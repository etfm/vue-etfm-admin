import { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '@etfma/hooks';
import type { Language } from '@etfma/types';

export interface ConfigProviderContextProps {
  mergedLocaleRef: Ref<Language | undefined>;
  mergedThemeRef: Ref<object | undefined>;
}

const key: InjectionKey<ConfigProviderContextProps> = Symbol();

export function createConfigProviderContext(context: ConfigProviderContextProps) {
  return createContext<ConfigProviderContextProps>(key, context);
}

export function useConfigProviderContext() {
  return useContext<ConfigProviderContextProps>(key);
}
