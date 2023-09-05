import { lodash } from '@etfm/shared';
import { initPinia } from './pinia';
import type { Pinia } from 'pinia';
import type { IPiniaContext } from '@etfm/types';

export const DEFAULT_CACHE_KEY = 'pinia';

export let context: IPiniaContext = {
  isCache: true,
  key: DEFAULT_CACHE_KEY,
};

export let store: Pinia;

export function register(...opts: IPiniaContext[]) {
  context = lodash.merge(context, opts);

  store = initPinia();

  return store;
}
