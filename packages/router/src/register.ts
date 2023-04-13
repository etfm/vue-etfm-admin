import { createRouter, type Router, type RouteRecordRaw } from 'vue-router'
import { registerRouter } from './routesConvention'
import { getPluginManager } from '@etfm/vea-plugin'
import { createHistory } from './history'
import type { IContext } from './types'

export let router: Router

export function register() {
  // 收集配置信息
  const router = getPluginManager().applyPlugins({
    key: 'router'
  })

  // 路由转换
  // @view/login/login.vue ==> import('@view/login/login.vue')
  const routeList = registerRouter(opts.routes)

  const history = createHistory({
    type: routerConfig.historyType || 'hash',
    basename: routerConfig.basename || '/'
  })

  // 创建一个可以被 Vue 应用程序使用的路由实例
  router = createRouter({
    ...routerConfig,
    // 创建一个 hash 历史记录。
    history: history,
    // 应该添加到路由的初始路由列表。
    routes: routeList as unknown as RouteRecordRaw[],
    // 是否应该禁止尾部斜杠。默认为假
    strict: true
  })

  return router
}
