import type { App } from 'vue'
import { defineRouter } from './defineRouter'
import type { AppRouteRecordRaw } from './types'
import type { Router, RouterOptions } from 'vue-router'

export interface IContext extends Omit<RouterOptions, 'history' | 'routes'> {
  // 路由表
  routers: AppRouteRecordRaw[]
  roles?: string[]
  onMounted?: (param: { app: App; router: Router; routes?: AppRouteRecordRaw[] }) => void
  beforePatchRoutes?: (routers: AppRouteRecordRaw[]) => void
  patchRoutes?: (routers: AppRouteRecordRaw[]) => void
}

export let rootApp: App
export let context: IContext = {
  routers: []
}

export const register = (app: App, opts: IContext) => {
  rootApp = app
  context = opts

  defineRouter(rootApp, opts)
}
