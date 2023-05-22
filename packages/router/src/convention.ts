import { flatMultiLevelRoutes, routeRemoveFilter, transformObjToRoute } from './utils';
import { filter, lodash } from '@etfma/shared';
import type { AppRouteRecordRaw } from '@etfma/types';
import { context } from './register';
import type { RouteRecordRaw } from 'vue-router';
import { router } from './router';

// 注册路由
export function registerRouter(routes: AppRouteRecordRaw[]) {
  if (routes && !lodash.isEmpty(routes)) {
    // 拷贝路由，动态路由追加
    transformObjToRoute(routes as any);

    if (context.onInitTransformRoute) {
      routes = context.onInitTransformRoute({ routes });
    }

    const patchRoutes = flatMultiLevelRoutes(routes);
    return patchRoutes;
  } else {
    return [];
  }
}

// 添加路由
export function addDynamicRoute(routes: AppRouteRecordRaw[] | AppRouteRecordRaw) {
  const rouls = context.rouls && lodash.isFunction(context.rouls) ? context.rouls() : context.rouls;

  if (routes && !lodash.isEmpty(routes)) {
    routes = lodash.isArray(routes) ? routes : [routes];

    // 拷贝路由，动态路由追加
    transformObjToRoute(routes as any);
    // 忽略路由
    const filterRoutes = filter(routes, (route) => routeRemoveFilter(route, rouls as string[]));
    // 路由打平到二级路由
    const patchRoutes = flatMultiLevelRoutes(filterRoutes);
    // 追加到路由表
    patchRoutes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    // 返回过滤后的路由
    // 1. 生成菜单场景
    return filterRoutes;
  }
}
