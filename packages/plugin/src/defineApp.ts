import type { IContext as IPiniaContext } from '@etfm/vea-pinia';
import type { IContext as IRenderContext } from '@etfm/vea-render';
import type { IContext as IHttpContext } from '@etfm/vea-http';

import { IRouterContext } from '@etfm/vea-types';

interface IRuntimeConfig {
  router?: IRouterContext;
  pinia?: IPiniaContext;
  render?: IRenderContext;
  http?: IHttpContext;
  [key: string]: any;
}

export function defineApp(config: IRuntimeConfig): IRuntimeConfig {
  return config;
}
