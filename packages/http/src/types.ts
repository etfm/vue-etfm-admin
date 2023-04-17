import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { AxiosTransform } from './axiosTransform'

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined
export type SuccessMessageMode = ErrorMessageMode

export interface RequestOptions<T = any> {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean
  // Format request parameter time
  formatDate?: boolean
  // Whether to process the request result
  isTransformResponse?: boolean
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean
  // Whether to join url
  joinPrefix?: boolean
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode
  // Success message prompt type
  successMessageMode?: SuccessMessageMode
  // Whether to add a timestamp
  joinTime?: boolean
  ignoreCancelToken?: boolean
  // Whether to send token in header
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
  errorConfig?: {
    errorHandler?: IErrorHandler
    errorThrower?: (res: T) => void
  }
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
}

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}
export interface Result<T = any> {
  code: number
  type: 'success' | 'error' | 'warning'
  message: string
  result: T
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}

interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
}

type IRequestInterceptorAxios = (config: IRequestOptions) => IRequestOptions

type IRequestInterceptor = IRequestInterceptorAxios
type IErrorInterceptor = (error: Error) => Promise<Error>
type IResponseInterceptor = <T = any>(response: AxiosResponse<T>) => AxiosResponse<T>
export type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor
export type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor

interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
  [key: string]: any
}

type RequestError = AxiosError | Error

interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void
}

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler
    errorThrower?: (res: T) => void
  }
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}
