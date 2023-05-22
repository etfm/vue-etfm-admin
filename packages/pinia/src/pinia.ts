import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { persistGlobalConfig } from './persist';
import { DEFAULT_CACHE_KEY, context } from './register';
import { lodash } from '@etfma/shared';

export function initPinia() {
  const pinia = createPinia();

  const key = lodash.isFunction(context.key) ? context.key() : context.key;

  pinia.use(createPersistedState(persistGlobalConfig(key || DEFAULT_CACHE_KEY)));

  return pinia;
}
