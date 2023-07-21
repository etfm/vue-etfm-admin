import { computed, getCurrentInstance, inject, unref } from 'vue';
import { loggerDebug, isClient } from '@etfma/shared';

import type { InjectionKey, Ref } from 'vue';
import type { MaybeRef } from '@vueuse/core';

export type ElIdInjectionContext = {
  prefix: number;
  current: number;
};

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
};

export const ID_INJECTION_KEY: InjectionKey<ElIdInjectionContext> = Symbol('elIdInjection');

export const useIdInjection = (): ElIdInjectionContext => {
  return getCurrentInstance() ? inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
};

export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = useIdInjection();
  if (!isClient && idInjection === defaultIdInjection) {
    loggerDebug(
      'IdInjection',
      `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`,
    );
  }

  const idRef = computed(
    () => unref(deterministicId) || `id-${idInjection.prefix}-${idInjection.current++}`,
  );

  return idRef;
};
