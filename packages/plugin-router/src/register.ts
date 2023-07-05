import type { IRouterContext, Router } from '@etfma/types';
import { initRouter } from './router';
import { lodash } from '@etfma/shared';

export let context: IRouterContext = {
  historyType: 'hash',
  basename: '/',
  routes: [],
};

export let router: Router;

export function register(...opts: IRouterContext[]) {
  context = lodash.merge(context, ...opts);

  router = initRouter();

  // 初始化路由
  return router;
}
