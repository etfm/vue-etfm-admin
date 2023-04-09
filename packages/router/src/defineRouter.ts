import type { App } from 'vue'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import type { IContext } from './register'

export function defineRouter(app: App, opts: IContext) {
  // 路由转换
  // @view/login/login.vue ==> import('@view/login/login.vue')

  // 创建一个可以被 Vue 应用程序使用的路由实例
  const router = createRouter({
    // 创建一个 hash 历史记录。
    history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
    // 应该添加到路由的初始路由列表。
    routes: opts.routers as unknown as RouteRecordRaw[],
    // 是否应该禁止尾部斜杠。默认为假
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 })
  })

  // 注册router
  app.use(router)
}
