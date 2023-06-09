import { getPluginManager } from '@etfma/plugin';
import type { RouterContext } from '@etfma/types';
import { initRouter } from './router';
import { lodash } from '@etfma/shared';
import type { Router } from 'vue-router';

export let context: RouterContext = {
  layoutView: () => {
    const key = '/src/layouts/index.vue';
    const viewMap = import.meta.glob('/src/layouts/index.vue');
    if (lodash.isEmpty(viewMap)) {
      throw new Error('在src/layouts/下找不到index.vue, 请自行创建!');
    }

    return viewMap[key] as any;
  },
  iframeView: () => {
    const key = '/src/layouts/iframe.vue';
    const viewMap = import.meta.glob('/src/layouts/iframe.vue');
    if (lodash.isEmpty(viewMap)) {
      throw new Error('在src/layouts/下找不到iframe.vue, 请自行创建!');
    }
    return viewMap[key] as any;
  },
  historyType: 'hash',
  basename: '/',
  routes: [],
};

export let router: Router;

export function register(opts?: RouterContext) {
  // 收集配置信息
  const routerConfig = getPluginManager().applyPlugins({
    key: 'router',
  });

  context = lodash.merge(context, opts, routerConfig);

  router = initRouter();

  // 初始化路由
  return router;
}
