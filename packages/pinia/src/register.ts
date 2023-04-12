import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { persistGlobalConfig } from './persist'

export function register() {
  const pinia = createPinia()

  pinia.use(createPersistedState(persistGlobalConfig(createStorageName(import.meta.env))))

  return pinia
}
