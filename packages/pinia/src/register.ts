import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { persistGlobalConfig } from './persist'
import { getStorageShortName } from '@etfm/vea-shared'

export function register() {
  const pinia = createPinia()

  pinia.use(createPersistedState(persistGlobalConfig(getStorageShortName())))

  return pinia
}
