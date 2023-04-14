import { getPluginManager } from '@etfm/vea-plugin'
import type { AppRouteRecordRaw } from './types'
import { initRouter } from './router'
import { lodash } from '@etfm/vea-shared'

export interface IContext {
  routes: AppRouteRecordRaw[]
  historyType?: string
  basename?: string
  rouls?: string[] | (() => string[])
  onInitTransformRoute?: Function
}

export let context: IContext = {
  historyType: 'hash',
  basename: '/',
  routes: []
}

export function register(opts?: IContext) {
  // 收集配置信息
  const router = getPluginManager().applyPlugins({
    key: 'router'
  })

  context = lodash.merge(context, opts, router)

  // 初始化路由
  return initRouter()
}
