import type { Pinia } from 'pinia'
import type { App } from 'vue'
import type { Router, RouterOptions } from 'vue-router'

interface IAppRouter extends Omit<RouterOptions, 'history' | 'routes' | 'strict'> {
  rules?: string[] | Function
}

interface IDefaultRuntimeConfig {
  render?: (oldRender: () => void) => void
  rootContainer?: (lastRootContainer: JSX.Element, args?: any) => void
  onInitTransformRoute?: (props: { router: Router }) => void
  onRouterCreated?: (props: { router: Router }) => void
  onPiniaCreated?: (props: { pinia: Pinia }) => void
  onAppCreated?: (props: { app: App; router?: Router; pinia: Pinia }) => void
  onMounted?: (props: { app: App; router?: Router; pinia: Pinia }) => void
  [key: string]: any
}

export type RuntimeConfig = IDefaultRuntimeConfig & {
  router?: IAppRouter
}

export function defineApp(config: RuntimeConfig): RuntimeConfig {
  return config
}
