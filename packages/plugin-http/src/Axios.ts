import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import type {
  IRequestInterceptorTuple,
  IResponseInterceptorTuple,
  RequestConfig,
  Result,
  UploadFileParams,
} from '@etfm/types';
import axios from 'axios';
import qs from 'qs';
import { ContentTypeEnum, RequestEnum } from './enum';
import { defaultInterceptor } from './axiosTransform';
import { context } from './register';
import { ErrorThrow } from './ErrorThrow';

export * from './axiosTransform';

/**
 * @description:  axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: RequestConfig;

  constructor(options: RequestConfig) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: RequestConfig): void {
    this.axiosInstance = axios.create(config);
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: RequestConfig) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  getRequestInstance(
    requestInterceptors: IRequestInterceptorTuple[],
    responseInterceptors: IResponseInterceptorTuple[],
  ) {
    const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
      if (interceptor instanceof Array) {
        return this.axiosInstance.interceptors.request.use(interceptor[0] as any, interceptor[1]);
      } else {
        return this.axiosInstance.interceptors.request.use(interceptor as any);
      }
    });

    const responseInterceptorsToEject = responseInterceptors?.map((interceptor) => {
      if (interceptor instanceof Array) {
        return this.axiosInstance.interceptors.response.use(interceptor[0], interceptor[1]);
      } else {
        return this.axiosInstance.interceptors.response.use(interceptor);
      }
    });

    return {
      requestInterceptorsToEject,
      responseInterceptorsToEject,
    };
  }

  /**
   * @description: Interceptor configuration 拦截器配置
   */
  private setupInterceptors() {
    const { requestInterceptors, responseInterceptors } = defaultInterceptor(this.options);

    this.getRequestInstance(requestInterceptors, responseInterceptors);

    this.getRequestInstance(context.requestInterceptors || [], context.responseInterceptors || []);
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data![key]);
      });
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true,
      },
    });
  }

  // support form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  get<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: RequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: RequestConfig): Promise<T> {
    const opt: RequestConfig = Object.assign({}, this.options, config);
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getRequestInstance(
      config?.requestInterceptors ?? [],
      config?.responseInterceptors ?? [],
    );

    this.axiosInstance.interceptors.request.use(undefined, (error) => {
      if (error instanceof ErrorThrow) return Promise.reject(error);

      return Promise.reject(
        new ErrorThrow({
          name: error?.name,
          message: error?.message,
          code: error?.request?.status,
          type: error?.code,
          info: error,
        }),
      );
    });

    this.axiosInstance.interceptors.response.use(undefined, (error) => {
      if (error instanceof ErrorThrow) return Promise.reject(error);
      return Promise.reject(
        new ErrorThrow({
          name: error?.name,
          message: error?.message,
          code: error?.response?.status,
          type: error?.code,
          info: error,
        }),
      );
    });

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          requestInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.request.eject(interceptor);
          });
          responseInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.response.eject(interceptor);
          });
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: any) => {
          requestInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.request.eject(interceptor);
          });
          responseInterceptorsToEject?.forEach((interceptor) => {
            this.axiosInstance.interceptors.response.eject(interceptor);
          });

          try {
            const handler = config?.onError ?? context.onError;
            if (handler) handler(e, opt);
          } catch (e) {
            reject(e);
          }
          reject(e);
        });
    });
  }
}
