import type { IContext as IRouterContext } from '@etfm/vea-router'
import type { IContext as IPiniaContext } from '@etfm/vea-pinia'
import type { IContext as IRenderContext } from '@etfm/vea-render'

interface IDefaultRuntimeConfig {
  router?: IRouterContext
  pinia?: IPiniaContext
  render?: IRenderContext
  [key: string]: any
}

export type RuntimeConfig = IDefaultRuntimeConfig & {}

export function defineApp(config: RuntimeConfig): RuntimeConfig {
  return config
}
