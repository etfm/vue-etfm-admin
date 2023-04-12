import type { App } from 'vue'
import type { Router, RouterOptions } from 'vue-router'

interface IAppRouter extends Omit<RouterOptions, 'history' | 'routes' | 'strict'> {
  rules?: string[] | Function
}

interface IDefaultRuntimeConfig {
  render?: (oldRender: () => void) => void
  rootContainer?: (lastRootContainer: JSX.Element, args?: any) => void
  onInitTransformRoute?: (props: { router: Router }) => void
  onRouterCreated?: (props: { app: App; router: Router }) => void
  onAppCreated?: (props: { app: App; router?: Router }) => void
  onMounted?: (props: { app: App; router?: Router }) => void
  [key: string]: any
}

export type RuntimeConfig = IDefaultRuntimeConfig & {
  router?: IAppRouter
}

export function defineApp(config: RuntimeConfig): RuntimeConfig {
  return config
}
