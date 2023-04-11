import { flatMultiLevelRoutes, routeRemoveFilter, transformObjToRoute } from './routerUtils'
import { filter, lodash, loggerWarning } from '@etfm/vea-shared'
import type { AppRouteRecordRaw } from './types'
import { router } from './defineRouter'
import type { RouteRecordRaw } from 'vue-router'
import { ApplyPluginsType, getPluginManager } from '@etfm/vea-plugin'

let treeRouteList: AppRouteRecordRaw[] = []
// 打平后的route，最后结果route
let routeList: AppRouteRecordRaw[] = []

export function getConventionRoutes(routes: AppRouteRecordRaw[]) {
  // 拷贝路由，动态路由追加
  treeRouteList = lodash.cloneDeep(routes)
  transformObjToRoute(routes as any)

  const routerConfig = getPluginManager().applyPlugins({
    key: 'router',
    type: ApplyPluginsType.modify,
    initialValue: {}
  })

  const rouls = routerConfig.rouls

  const filterRoutes = filter(routes, (route) => routeRemoveFilter(route, rouls))

  // 打平之前钩子
  getPluginManager().applyPlugins({
    type: ApplyPluginsType.event,
    key: 'onBeforePatchRoutes',
    args: {
      routes: filterRoutes
    }
  })

  const patchRoutes = flatMultiLevelRoutes(filterRoutes)
  // 打平的路由表
  getPluginManager().applyPlugins({
    type: ApplyPluginsType.event,
    key: 'onPatchRoutes',
    args: {
      routes: patchRoutes
    }
  })
  return patchRoutes
}

export function registerRouter(routes: AppRouteRecordRaw[]) {
  if (routes && !lodash.isEmpty(routes)) {
    routeList = getConventionRoutes(routes)
    return routeList
  } else {
    return []
  }
}

// 添加路由
export function addRoutes(routes: AppRouteRecordRaw[] | AppRouteRecordRaw) {
  if (routes && !lodash.isEmpty(routes)) {
    routes = lodash.isArray(routes) ? routes : [routes]

    const addRoutes = treeRouteList.concat(routes)

    const patchRoutes = getConventionRoutes(addRoutes)

    patchRoutes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })

    return patchRoutes
  } else {
    loggerWarning('请添加路由')
  }
}

export function getRoutes() {
  return routeList
}
