import type { AppRouteRecordRaw } from '@etfm/vea-router'

import { defineStore, store } from '@etfm/vea-pinia'

import { getMenuList } from '@/api/sys/menu'
import { getPermCode } from '@/api/sys/user'
import type { Menu } from '@/router/types'

// import { useMessage } from '/@/hooks/web/useMessage'

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[]
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[]
  // 菜单列表
  frontMenuList: Menu[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
    // 菜单列表
    frontMenuList: []
  }),
  getters: {
    getPermCodeList(state): string[] | number[] {
      return state.permCodeList
    },
    getBackMenuList(state): Menu[] {
      return state.backMenuList
    },
    getFrontMenuList(state): Menu[] {
      return state.frontMenuList
    },
    getLastBuildMenuTime(state): number {
      return state.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(state): boolean {
      return state.isDynamicAddedRoute
    }
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list
      list?.length > 0 && this.setLastBuildMenuTime()
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    resetState(): void {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.backMenuList = []
      this.lastBuildMenuTime = 0
    },
    async changePermissionCode() {
      const codeList = await getPermCode()
      this.setPermCodeList(codeList)
    },

    // 构建路由
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      // !Simulate to obtain permission codes from the background,
      // 模拟从后台获取权限码，
      // this function may only need to be executed once, and the actual project can be put at the right time by itself
      // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
      let routes: AppRouteRecordRaw[] = []
      try {
        await this.changePermissionCode()
        routes = (await getMenuList()) as AppRouteRecordRaw[]
      } catch (error) {
        console.error(error)
      }
      return routes
    }
  }
})

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
