import { createRouter, type Router, type RouteRecordRaw } from 'vue-router'
import { registerRouter } from './convention'
import { createHistory } from './history'
import { context } from './register'

export let router: Router

export function initRouter() {
  const routeList = registerRouter(context.routes)

  const history = createHistory({
    type: context.historyType,
    basename: context.basename
  })

  // 创建一个可以被 Vue 应用程序使用的路由实例
  router = createRouter({
    ...context,
    // 创建一个 hash 历史记录。
    history: history,
    // 应该添加到路由的初始路由列表。
    routes: routeList as unknown as RouteRecordRaw[],
    // 是否应该禁止尾部斜杠。默认为假
    strict: true
  })

  return router
}
