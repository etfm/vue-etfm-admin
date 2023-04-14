import { getPluginManager } from '@etfm/vea-plugin'
import { lodash } from '@etfm/vea-shared'
import { initPinia } from './pinia'
export interface IContext {
  isCache?: boolean
  key?: string | (() => string)
}

export let context = {
  isCache: true,
  key: 'pinia'
}

export function register(opts?: IContext) {
  // 收集配置信息
  const pinia = getPluginManager().applyPlugins({
    key: 'pinia'
  })

  context = lodash.merge(context, opts, pinia)

  return initPinia()
}
