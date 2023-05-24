import type {
  IRouterContext,
  IPiniaContext,
  IRenderContext,
  IHttpContext,
  ILocalContext,
} from '@etfma/types';

export interface IRuntimeConfig {
  router?: IRouterContext;
  pinia?: IPiniaContext;
  render?: IRenderContext;
  http?: IHttpContext;
  locale?: ILocalContext;
  [key: string]: any;
}

export function defineApp(config: IRuntimeConfig): IRuntimeConfig {
  return config;
}
