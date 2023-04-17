import type {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import type {
  CreateAxiosOptions,
  IRequestInterceptorTuple,
  IResponseInterceptorTuple,
  RequestConfig,
  RequestOptions,
  Result,
  UploadFileParams
} from './types'
import axios from 'axios'
import qs from 'qs'
import { AxiosCanceler } from './axiosCancel'
import { lodash } from '@etfm/vea-shared'
import { ContentTypeEnum, RequestEnum } from './enum'

export * from './axiosTransform'

/**
 * @description:  axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config)
  }

  private getTransform() {
    const { transform } = this.options
    return transform
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: CreateAxiosOptions) {
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
        return this.axiosInstance.interceptors.request.use((config) => {
          if (interceptor[0].length === 2) {
            const { url: newUrl, options } = interceptor[0](config)
            return { ...options, url: newUrl }
          }
          return interceptor[0](config)
        }, interceptor[1])
      } else {
        return this.axiosInstance.interceptors.request.use((config) => {
          if (interceptor.length === 2) {
            const { url: newUrl, options } = interceptor(config)
            return { ...options, url: newUrl }
          }
          return interceptor(config)
        })
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
    // const transform = this.getTransform();
    // const {
    //   axiosInstance,
    //   options: { transform }
    // } = this
    // if (!transform) {
    //   return
    // }
    // const {
    //   requestInterceptors,
    //   requestInterceptorsCatch,
    //   responseInterceptors,
    //   responseInterceptorsCatch
    // } = transform

    // const axiosCanceler = new AxiosCanceler()
    const config: RequestOptions & AxiosRequestConfig = {}
    this.getRequestInstance(config.requestInterceptors ?? [], config.responseInterceptors ?? [])

    // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
    this.axiosInstance.interceptors.response.use((response) => {
      const { data } = response
      if (data?.success === false && config?.errorConfig?.errorThrower) {
        config.errorConfig.errorThrower(data)
      }
      return response
    })

    // Request interceptor configuration processing
    // this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    //   // If cancel repeat request is turned on, then cancel repeat request is prohibited
    //   const { requestOptions } = this.options
    //   const ignoreCancelToken = requestOptions?.ignoreCancelToken ?? true

    //   !ignoreCancelToken && axiosCanceler.addPending(config)

    //   if (requestInterceptors && lodash.isFunction(requestInterceptors)) {
    //     config = requestInterceptors(config, this.options)
    //   }
    //   return config
    // }, undefined)

    // // Request interceptor error capture
    // requestInterceptorsCatch &&
    //   lodash.isFunction(requestInterceptorsCatch) &&
    //   this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // // Response result interceptor processing
    // this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
    //   res && axiosCanceler.removePending(res.config)
    //   if (responseInterceptors && lodash.isFunction(responseInterceptors)) {
    //     res = responseInterceptors(res)
    //   }
    //   return res
    // }, undefined)

    // // Response result interceptor error capture
    // responseInterceptorsCatch &&
    //   lodash.isFunction(responseInterceptorsCatch) &&
    //   this.axiosInstance.interceptors.response.use(undefined, (error) => {
    //     return responseInterceptorsCatch(axiosInstance, error)
    //   })
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

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    const configApp: RequestOptions & AxiosRequestConfig = {}
    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options)
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getRequestInstance(
      options?.requestInterceptors ?? [],
      options?.responseInterceptors ?? []
    )

    let conf: CreateAxiosOptions = lodash.cloneDeep(config)
    // cancelToken 如果被深拷贝，会导致最外层无法使用cancel方法来取消请求
    if (config.cancelToken) {
      conf.cancelToken = config.cancelToken
    }

    const transform = this.getTransform()

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {}
    if (beforeRequestHook && lodash.isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          // if (transformResponseHook && lodash.isFunction(transformResponseHook)) {
          //   try {
          //     const ret = transformResponseHook(res, opt)
          //     resolve(ret)
          //   } catch (err) {
          //     reject(err || new Error('request error!'))
          //   }
          //   return
          // }
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
            const handler =
              options?.errorConfig?.errorHandler ?? configApp.errorConfig?.errorHandler
            if (handler) handler(e, { ...config, ...opt }, configApp)
          } catch (e) {
            reject(e)
          }
          reject(e)
          // if (requestCatchHook && lodash.isFunction(requestCatchHook)) {
          //   reject(requestCatchHook(e, opt))
          //   return
          // }
          // if (axios.isAxiosError(e)) {
          //   // rewrite error message from axios in here
          // }
          // reject(e)
        })
    })
  }
}
