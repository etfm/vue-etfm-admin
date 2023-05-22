import type { IRouterContext, IPiniaContext, IRenderContext, IHttpContext } from '@etfma/types';

export interface IRuntimeConfig {
  router?: IRouterContext;
  pinia?: IPiniaContext;
  render?: IRenderContext;
  http?: IHttpContext;
  [key: string]: any;
}

export function defineApp(config: IRuntimeConfig): IRuntimeConfig {
  return config;
}
