import { flatMultiLevelRoutes, routeRemoveFilter, transformObjToRoute } from './routerUtils'
import { filter, lodash } from '@etfm/vea-shared'
import type { AppRouteRecordRaw } from './types'
import { router } from './register'
import type { RouteRecordRaw } from 'vue-router'
import { ApplyPluginsType, getPluginManager } from '@etfm/vea-plugin'

// 注册路由
export function registerRouter(routes: AppRouteRecordRaw[]) {
  if (routes && !lodash.isEmpty(routes)) {
    // 拷贝路由，动态路由追加
    transformObjToRoute(routes as any)

    getPluginManager().applyPlugins({
      type: ApplyPluginsType.event,
      key: 'onInitTransformRoute',
      args: {
        routes
      }
    })

    const patchRoutes = flatMultiLevelRoutes(routes)
    return patchRoutes
  } else {
    return []
  }
}

// 添加路由
export function addDynamicRoute(routes: AppRouteRecordRaw[] | AppRouteRecordRaw) {
  const routerConfig = getPluginManager().applyPlugins({
    key: 'router',
    type: ApplyPluginsType.modify,
    initialValue: {}
  })

  const rouls = routerConfig.rouls

  if (routes && !lodash.isEmpty(routes)) {
    routes = lodash.isArray(routes) ? routes : [routes]

    // 拷贝路由，动态路由追加
    transformObjToRoute(routes as any)
    const filterRoutes = filter(routes, (route) => routeRemoveFilter(route, rouls))

    const patchRoutes = flatMultiLevelRoutes(filterRoutes)

    patchRoutes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })

    return filterRoutes
  }
}
