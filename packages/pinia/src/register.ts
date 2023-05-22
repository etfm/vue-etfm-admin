import { getPluginManager } from '@etfma/plugin';
import { lodash } from '@etfma/shared';
import { initPinia } from './pinia';
import type { Pinia } from 'pinia';
import type { IPiniaContext } from '@etfma/types';

export const DEFAULT_CACHE_KEY = 'pinia';

export let context: IPiniaContext = {
  isCache: true,
  key: DEFAULT_CACHE_KEY,
};

export let store: Pinia;

export function register(opts?: IPiniaContext) {
  // 收集配置信息
  const pinia = getPluginManager().applyPlugins({
    key: 'pinia',
  });

  context = lodash.merge(context, opts, pinia);

  store = initPinia();

  return store;
}
