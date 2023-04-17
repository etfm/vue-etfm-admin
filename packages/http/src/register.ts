import { getPluginManager } from '@etfm/vea-plugin'
import { lodash } from '@etfm/vea-shared'
import { initHttp } from './http'
import type { ErrorMessageMode } from './types'
export interface IContext {
  errorFunction: AnyFunction<any>
  msgFunction: AnyFunction<any>
  errorModalFunction: AnyFunction<any>
  noticeFunction: AnyFunction<any>
  getTokenFunction: () => unknown
  unauthorizedFunction: (msg?: string) => void
  timeoutFunction: () => void
  handleErrorFunction: (message?: string, mode?: ErrorMessageMode) => void
  apiUrl?: string
}

export let context = {
  getTokenFunction: () => undefined,
  unauthorizedFunction: () => {},
  errorFunction: () => {},
  msgFunction: () => {},
  noticeFunction: () => {},
  errorModalFunction: () => {},
  handleErrorFunction: () => {},
  timeoutFunction: () => {},
  apiUrl: ''
}

export function register(opts?: IContext) {
  // 收集配置信息
  const http = getPluginManager().applyPlugins({
    key: 'http'
  })

  context = lodash.merge(context, opts, http)

  store = initHttp()

  return store
}
