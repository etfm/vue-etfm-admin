import { getPluginManager } from '@etfm/vea-plugin';
import type { IRouterContext } from '@etfm/vea-types';
import { initRouter } from './router';
import { lodash } from '@etfm/vea-shared';

export let context: IRouterContext = {
  historyType: 'hash',
  basename: '/',
  routes: [],
};

export function register(opts?: IRouterContext) {
  // 收集配置信息
  const router = getPluginManager().applyPlugins({
    key: 'router',
  });

  context = lodash.merge(context, opts, router);

  // 初始化路由
  return initRouter();
}
