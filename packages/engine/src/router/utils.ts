import { lodash } from '@etfm/shared';
import type { AppRouteModule, AppRouteRecordRaw } from '@etfm/types';
import {
  createWebHashHistory,
  type RouteRecordNormalized,
  type Router,
  createRouter,
} from 'vue-router';

/**
 * Convert multi-level routing to level 2 routing
 * 将多级路由转换为 2 级路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = lodash.cloneDeep(routeModules);

  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断级别是否 多级 路由
    if (!isMultipleRoute(routeModule)) {
      // 声明终止当前循环， 即跳过此次循环，进行下一轮
      continue;
    }
    // 路由等级提升
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
// 路由等级提升
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  // 使用vue-router拼接菜单
  // createRouter 创建一个可以被 Vue 应用程序使用的路由实例
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });
  // getRoutes： 获取所有 路由记录的完整列表。
  const routes = router.getRoutes();
  // 将所有子路由添加到二级路由
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  // omit lodash的函数 对传入的item对象的children进行删除
  routeModule.children = routeModule.children?.map((item) => lodash.omit(item, 'children')) as any;
}

// Add all sub-routes to the secondary route
// 将所有子路由添加到二级路由
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
// 判断级别是否超过2级
function isMultipleRoute(routeModule: AppRouteModule) {
  // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

export const routeRemoveFilter = (route: AppRouteRecordRaw, roleList: string[]) => {
  const { meta } = route;
  // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
  const { ignoreRoute, roles } = meta || {};
  // arr.filter 返回 true 表示该元素通过测试

  if (!ignoreRoute && !roles) {
    return true;
  }
  const hasRoles = roleList?.some((role) => (roles as string[]).includes(role)) ?? true;

  return hasRoles;
};
