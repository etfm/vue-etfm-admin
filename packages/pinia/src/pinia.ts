import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { persistGlobalConfig } from './persist'
import { context } from './register'

export function initPinia() {
  const pinia = createPinia()

  pinia.use(createPersistedState(persistGlobalConfig(context.key)))

  return pinia
}
