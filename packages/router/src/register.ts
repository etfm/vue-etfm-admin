import type { App } from 'vue'
import { defineRouter } from './defineRouter'

let App = null

export interface IContext {
  // 路由表
  routers: []
  // 在初始加载和路由切换时做一些事情。
  onRouteChange?: Function
  patchRoutes?: Function
  // 修改被渲染前的树状路由表
  patchClientRoutes?: Function
}

export let context: IContext = {
  routers: []
}

export const register = (app: App, opts: IContext) => {
  App = app
  context = opts

  defineRouter(app, opts)
}
