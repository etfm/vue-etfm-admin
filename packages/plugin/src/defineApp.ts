import type {
  RouterContext,
  IPiniaContext,
  IRenderContext,
  IHttpContext,
  I18nContext,
} from '@etfma/types';

export interface IRuntimeConfig {
  router?: RouterContext;
  pinia?: IPiniaContext;
  render?: IRenderContext;
  http?: IHttpContext;
  locale?: I18nContext;
  [key: string]: any;
}

export function defineApp(config: IRuntimeConfig): IRuntimeConfig {
  return config;
}
