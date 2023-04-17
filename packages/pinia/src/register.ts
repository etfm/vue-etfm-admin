import { getPluginManager } from '@etfm/vea-plugin'
import { lodash } from '@etfm/vea-shared'
import { initPinia } from './pinia'
import type { Pinia } from 'pinia'
export interface IContext {
  isCache?: boolean
  key?: string | (() => string)
}

export let context = {
  isCache: true,
  key: 'pinia'
}

export let store: Pinia

export function register(opts?: IContext) {
  // 收集配置信息
  const pinia = getPluginManager().applyPlugins({
    key: 'pinia'
  })

  context = lodash.merge(context, opts, pinia)

  store = initPinia()

  return store
}
