import type { AxiosResponse } from 'axios'
import { AxiosCanceler } from './axiosCancel'
import type { IRequestInterceptorTuple, IResponseInterceptorTuple, RequestConfig } from './types'
import { lodash } from '@etfm/vea-shared'
import { appendUrlParams, formatRequestDate, joinTimestamp } from './helper'
import { RequestEnum } from './enum'
import { ErrorThrow } from './ErrorThrow'

// 设置默认拦截器
export function defaultInterceptor(opts: RequestConfig) {
  const axiosCanceler = new AxiosCanceler()
  const requestInterceptors: IRequestInterceptorTuple[] = [
    [
      (config: RequestConfig) => {
        const { ignoreCancelToken } = config
        const ignoreCancel =
          ignoreCancelToken !== undefined
            ? ignoreCancelToken
            : opts.requestOptions?.ignoreCancelToken

        !ignoreCancel && axiosCanceler.addPending(config)

        return config
      }
    ],
    [
      // 处理请求前的数据
      (config: RequestConfig) => {
        const {
          apiUrl,
          joinPrefix,
          joinParamsToUrl,
          formatDate,
          joinTime = true,
          urlPrefix
        } = config
        if (joinPrefix) {
          config.url = `${urlPrefix}${config.url}`
        }

        if (apiUrl && lodash.isString(apiUrl)) {
          config.url = `${apiUrl}${config.url}`
        }

        const params = config.params || {}
        const data = config.data || false
        formatDate && data && !lodash.isString(data) && formatRequestDate(data)
        if (config.method?.toUpperCase() === RequestEnum.GET) {
          if (!lodash.isString(params)) {
            // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
            config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
          } else {
            // 兼容restful风格
            config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
            config.params = undefined
          }
        } else {
          if (!lodash.isString(params)) {
            formatDate && formatRequestDate(params)
            if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
              config.data = data
              config.params = params
            } else {
              // 非GET请求如果没有提供data，则将params视为data
              config.data = params
              config.params = undefined
            }
            if (joinParamsToUrl) {
              config.url = appendUrlParams(
                config.url as string,
                Object.assign({}, config.params, config.data)
              )
            }
          } else {
            // 兼容restful风格
            config.url = config.url + params
            config.params = undefined
          }
        }
        return config
      }
    ]
  ]

  const responseInterceptors: IResponseInterceptorTuple[] = [
    [
      (response) => {
        if (response.isReturnNativeResponse) {
          return response
        }

        if (response.isTransformResponse) {
          return response.data
        }

        const { data } = response

        if (!data) {
          throw new ErrorThrow({
            name: 'BizError',
            code: response.status,
            message: 'data 数据为空',
            type: 'RESPONSE',
            result: data
          })
        }
      }
    ],
    [
      (res: AxiosResponse<any>) => {
        res && axiosCanceler.removePending(res.config)

        return res
      },
      (error: any) => {
        return Promise.reject(
          new ErrorThrow({
            name: error.name,
            message: error.message,
            code: error.response.status,
            type: 'RESPONSE'
          })
        )
      }
    ]
  ]

  return {
    requestInterceptors,
    responseInterceptors
  }
}
