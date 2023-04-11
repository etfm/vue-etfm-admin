import { inject } from 'vue'
import { AppContextKey } from './browser'

export function useAppData() {
  const state = inject(AppContextKey)
  if (!state) {
    throw new Error('AppContext is no provide')
  }

  return state
}
