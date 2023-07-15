import { ComponentInternalInstance, InjectionKey } from 'vue';
import { createContext, useContext } from '@etfma/hooks';

export interface TabsProviderContextProps {
  registerPane: (instance: ComponentInternalInstance) => void;
  unregisterPane: (key: string) => void;
  tabClick: (key: string) => void;
}

const key: InjectionKey<TabsProviderContextProps> = Symbol();

export function createTabsProviderContext(context: TabsProviderContextProps) {
  return createContext<TabsProviderContextProps>(key, context);
}

export function useTabsProviderContext() {
  return useContext<TabsProviderContextProps>(key);
}

export const DEFAULT_SIZE = { width: 0, height: 0, left: 0, top: 0, right: 0 };

export enum OP_TYPE {
  REFRESH,
  CLOSE_CURRENT,
  CLOSE_LEFT,
  CLOSE_RIGHT,
  CLOSE_OTHER,
  CLOSE_ALL,
}
