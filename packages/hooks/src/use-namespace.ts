/**
 * @see 改自 https://github.com/element-plus/element-plus/blob/dev/packages/hooks/use-namespace/index.ts
 * 去除了namespace,增加了cssModule
 */

import { computed, inject, ref, unref, useCssModule } from 'vue';

import type { InjectionKey, Ref } from 'vue';

export const defaultNamespace = 'etfm';
const statePrefix = 'is-';

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string,
  options: NamespaceOptios,
) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }

  if (options.isCssModule) {
    const $style = useCssModule();

    return $style[cls];
  } else {
    return cls;
  }
};

export const namespaceContextKey: InjectionKey<Ref<string | undefined>> =
  Symbol('namespaceContextKey');

export const useGetDerivedNamespace = (namespaceOverrides?: Ref<string | undefined>) => {
  const derivedNamespace = namespaceOverrides || inject(namespaceContextKey, ref(defaultNamespace));
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace;
  });
  return namespace;
};

export interface NamespaceOptios {
  isCssModule?: boolean;
  namespaceOverrides?: Ref<string | undefined>;
}

export const useNamespace = (block: string, options: NamespaceOptios = { isCssModule: true }) => {
  const namespace = useGetDerivedNamespace(options.namespaceOverrides);
  const b = (blockSuffix = '') => _bem(namespace.value, block, blockSuffix, '', '', options);
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '', options) : '';
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier, options) : '';
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, '', options) : '';
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(namespace.value, block, '', element, modifier, options) : '';
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, '', modifier, options) : '';
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier, options)
      : '';
  const is: {
    (name: string, state: boolean | undefined): string;
    (name: string): string;
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true;
    if (options.isCssModule) {
      const $style = useCssModule();
      return name && state ? $style[`${statePrefix}${name}`] : '';
    } else {
      return name && state ? `${statePrefix}${name}` : '';
    }
  };

  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key];
      }
    }
    return styles;
  };
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };

  const cssVarName = (name: string) => `--${namespace.value}-${name}`;
  const cssVarBlockName = (name: string) => `--${namespace.value}-${block}-${name}`;

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
