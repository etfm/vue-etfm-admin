import { flatMultiLevelRoutes, routeRemoveFilter, transformObjToRoute } from './routerUtils'
import { filter, lodash, loggerWarning } from '@etfm/vea-shared'
import type { AppRouteRecordRaw } from './types'
import { context } from './register'
import { router } from './defineRouter'
import type { RouteRecordRaw } from 'vue-router'

let treeRouteList: AppRouteRecordRaw[] = []
// 打平后的route，最后结果route
let routeList: AppRouteRecordRaw[] = []

export function getConventionRoutes(routes: AppRouteRecordRaw[]) {
  // 拷贝路由，动态路由追加
  treeRouteList = lodash.cloneDeep(routes)
  transformObjToRoute(routes as any)

  const filterRoutes = filter(routes, routeRemoveFilter)

  // 打平之前钩子
  context.beforePatchRoutes && context.beforePatchRoutes(filterRoutes)
  const patchRoutes = flatMultiLevelRoutes(filterRoutes)
  // 打平的路由表
  context.patchRoutes && context.patchRoutes(patchRoutes)
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

// 重置路由
export function resetRoutes(routes: AppRouteRecordRaw[]) {
  if (routes && !lodash.isEmpty(routes)) {
    return getConventionRoutes(routes)
  } else {
    loggerWarning('请添加路由')
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
