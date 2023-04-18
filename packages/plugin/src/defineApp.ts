import type { IContext as IRouterContext } from '@etfm/vea-router'
import type { IContext as IPiniaContext } from '@etfm/vea-pinia'
import type { IContext as IRenderContext } from '@etfm/vea-render'
import type { IContext as IHttpContext } from '@etfm/vea-http'

interface IDefaultRuntimeConfig {
  router?: IRouterContext
  pinia?: IPiniaContext
  render?: IRenderContext
  http?: IHttpContext
  [key: string]: any
}

export type RuntimeConfig = IDefaultRuntimeConfig & {}

export function defineApp(config: RuntimeConfig): RuntimeConfig {
  return config
}
