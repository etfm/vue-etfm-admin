import type { defineComponent } from 'vue'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export type Recordable<T = any> = Record<string, T>
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  name: string
  meta: RouteMeta
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export type AppRouteModule = AppRouteRecordRaw

export interface IContext {
  routes: AppRouteRecordRaw[]
}
