/**
 * @see 改自 https://github.com/element-plus/element-plus/blob/dev/packages/hooks/use-namespace/index.ts
 * 去除了namespace,增加了cssModule
 */

import { useCssModule } from 'vue';

let defaultNamespace = 'etfm';
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

export const useGetNamespace = (namespaceOverrides?: string) => {
  return namespaceOverrides || defaultNamespace;
};

export const useSetNamespace = (namespaceOverrides: string) => {
  defaultNamespace = namespaceOverrides;
};

export interface NamespaceOptios {
  isCssModule?: boolean;
  namespaceOverrides?: string;
}

export const useNamespace = (block: string, options: NamespaceOptios = { isCssModule: true }) => {
  const namespace = useGetNamespace(options.namespaceOverrides);
  const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix, '', '', options);
  const e = (element?: string) => (element ? _bem(namespace, block, '', element, '', options) : '');
  const m = (modifier?: string) =>
    modifier ? _bem(namespace, block, '', '', modifier, options) : '';
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element ? _bem(namespace, block, blockSuffix, element, '', options) : '';
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(namespace, block, '', element, modifier, options) : '';
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier ? _bem(namespace, block, blockSuffix, '', modifier, options) : '';
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace, block, blockSuffix, element, modifier, options)
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
        styles[`--${namespace}-${key}`] = object[key];
      }
    }
    return styles;
  };
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };

  const cssVarName = (name: string) => `--${namespace}-${name}`;
  const cssVarBlockName = (name: string) => `--${namespace}-${block}-${name}`;

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
