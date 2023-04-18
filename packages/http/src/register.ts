import { getPluginManager } from '@etfm/vea-plugin'
import { lodash } from '@etfm/vea-shared'
import { VAxios } from './Axios'
import { ContentTypeEnum } from './enum'
import type { RequestConfig } from './types'

export type IContext = RequestConfig

export let context: IContext = {
  resultField: {
    code: 'code',
    message: 'message',
    data: 'data'
  },
  successCode: 0,
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
  // authentication schemes，e.g: Bearer
  // authenticationScheme: 'Bearer',
  timeout: 10 * 1000,
  // 基础接口地址
  // baseURL: globSetting.apiUrl,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 默认将prefix 添加到url
  joinPrefix: true,
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse: false,
  // 需要对返回数据进行处理
  isTransformResponse: true,
  // post请求的时候添加参数到url
  joinParamsToUrl: false,
  // 格式化提交参数时间
  formatDate: true,
  // 消息提示类型
  errorMessageMode: 'message',
  // 接口地址
  apiUrl: '',
  // 接口拼接地址
  urlPrefix: '',
  //  是否加入时间戳
  joinTime: true,
  // 忽略重复请求
  ignoreCancelToken: true,
  // 是否携带token
  withToken: true,
  retryRequest: {
    isOpenRetry: true,
    count: 5,
    waitTime: 100
  }
}

export let http: VAxios

export function register(opts?: IContext) {
  // 收集配置信息
  const httpConfig = getPluginManager().applyPlugins({
    key: 'http'
  })

  context = lodash.merge(context, opts, httpConfig)

  console.log(context)

  http = new VAxios(context)

  return http
}
