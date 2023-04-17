import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import type {
  IRequestInterceptorTuple,
  IResponseInterceptorTuple,
  RequestConfig,
  Result,
  UploadFileParams
} from './types'
import axios from 'axios'
import qs from 'qs'
import { ContentTypeEnum, RequestEnum } from './enum'

export * from './axiosTransform'

/**
 * @description:  axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance
  private readonly options: RequestConfig

  constructor(options: RequestConfig) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: RequestConfig): void {
    this.axiosInstance = axios.create(config)
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: RequestConfig) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config)
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  getRequestInstance(
    requestInterceptors: IRequestInterceptorTuple[],
    responseInterceptors: IResponseInterceptorTuple[]
  ) {
    const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
      if (interceptor instanceof Array) {
        return this.axiosInstance.interceptors.request.use(interceptor[0] as any, interceptor[1])
      } else {
        return this.axiosInstance.interceptors.request.use(interceptor as any)
      }
    })

    const responseInterceptorsToEject = responseInterceptors?.map((interceptor) => {
      return interceptor instanceof Array
        ? this.axiosInstance.interceptors.response.use(interceptor[0], interceptor[1])
        : this.axiosInstance.interceptors.response.use(interceptor)
    })

    return {
      requestInterceptorsToEject,
      responseInterceptorsToEject
    }
  }

  /**
   * @description: Interceptor configuration 拦截器配置
   */
  private setupInterceptors() {
    const config: RequestConfig = {}
    this.getRequestInstance(config.requestInterceptors ?? [], config.responseInterceptors ?? [])

    // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
    this.axiosInstance.interceptors.response.use((response) => {
      const { data } = response
      if (data?.success === false && config?.errorConfig?.errorThrower) {
        config.errorConfig.errorThrower(data)
      }
      return response
    })
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data![key])
      })
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true
      }
    })
  }

  // support form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' })
    }
  }

  get<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  put<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  request<T = any>(config: RequestConfig): Promise<T> {
    const configApp: RequestConfig = {}

    const opt: RequestConfig = Object.assign({}, this.options, config)
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getRequestInstance(
      config?.requestInterceptors ?? [],
      config?.responseInterceptors ?? []
    )

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          requestInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.request.eject(interceptor)
          })
          responseInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.response.eject(interceptor)
          })
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          requestInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.request.eject(interceptor)
          })
          responseInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.response.eject(interceptor)
          })

          try {
            const handler = config?.errorConfig?.errorHandler ?? configApp.errorConfig?.errorHandler
            if (handler) handler(e, opt)
          } catch (e) {
            reject(e)
          }
          reject(e)
        })
    })
  }
}
