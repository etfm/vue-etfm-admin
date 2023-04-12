import type { AppRouteModule, AppRouteRecordRaw } from '@etfm/vea-router'

import { mainOutRoutes } from './mainOut'
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from './basic'
import { BASE_HOME } from './constant'

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts')
const routeModuleList: AppRouteModule[] = []

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [...routeModuleList]

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: BASE_HOME,
  meta: {
    title: 'Root'
  }
}

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: '/sys/login/login',
  meta: {
    title: '登录'
  }
}

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE
]
