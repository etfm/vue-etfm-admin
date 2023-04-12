import type { App } from 'vue'
import type { Router, RouterOptions } from 'vue-router'

interface IAppRouter extends Omit<RouterOptions, 'history' | 'routes' | 'strict'> {
  rules: string[] | Function
}

interface IDefaultRuntimeConfig {
  router?: IAppRouter
  render?: (oldRender: () => void) => void
  rootContainer?: (lastRootContainer: JSX.Element, args?: any) => void
  onInitTransformRoute?: (props: { router: Router }) => void
  onRouterCreated?: (app: App, router?: Router) => void
  onAppCreated?: (app: App, router?: Router) => void
  onMounted?: (app: App, router?: Router) => void
  [key: string]: any
}
export type RuntimeConfig = IDefaultRuntimeConfig

export function defineApp(config: RuntimeConfig): RuntimeConfig {
  return config
}
