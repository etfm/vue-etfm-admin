import { mainOutRoutes } from './mainOut';
import { PAGE_NOT_FOUND_ROUTE } from './basic';
import { BASE_HOME } from './constant';
import { loggerWarning, traverseTree } from '@etfma/shared';
import {
  AppRouteModule,
  AppRouteRecordRaw,
  RouteRecordName,
  RouteRecordRaw,
  globalRouter,
} from '@etfma/core';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts');
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules[key] as any).default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

const dynamicRoutes = [...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: BASE_HOME,
  meta: {
    title: 'Root',
    hideMenu: true,
    hideTab: true,
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: '/sys/login/index',
  meta: {
    title: '登录',
    hideMenu: true,
    hideTab: true,
  },
};

// Basic routing without permission
// 未经许可的基本路由
const staticRoutes = [LoginRoute, RootRoute, ...mainOutRoutes, PAGE_NOT_FOUND_ROUTE];

/** 排查在主框架外的路由，这些路由没有菜单和顶部及其他框架内容 */
const externalRoutes: RouteRecordRaw[] = [];

/**
 * @description 获取静态路由所有节点包含子节点的 name，并排除不存在 name 字段的路由
 */
const staticRouteNames = traverseTree<AppRouteRecordRaw, RouteRecordName | undefined>(
  staticRoutes,
  (route) => route.children,
  (route) => {
    // 提示这些路由需要指定 name，防止在路由重置时，不能删除没有指定 name 的路由
    if (!route.name) {
      loggerWarning(`The route with the path ${route.path} needs to specify the field name`);
    }
    return route.name;
  },
);
/**
 * @description 重置路由
 */
function resetRoutes() {
  const routes = globalRouter.router.getRoutes();
  const { hasRoute, removeRoute } = globalRouter.router;
  routes.forEach(({ name }) => {
    // 存在于路由表且非白名单才需要删除
    if (name && !staticRouteNames.includes(name) && hasRoute(name)) {
      removeRoute(name);
    }
  });
}

export { dynamicRoutes, externalRoutes, staticRouteNames, staticRoutes, resetRoutes };
