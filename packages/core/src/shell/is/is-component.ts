import { h } from 'vue';
import { hasOwnProperty } from '../has-own-property';
import { lodash } from '@etfma/shared';

export function isComponent(comp: any): boolean {
  const vnode = h(comp);

  if (!vnode.type) {
    return false;
  }
  // Check if it's just an HTML Element
  if (typeof vnode.type === 'string') {
    return false;
  }
  // A component that has render or setup property
  if (
    hasOwnProperty(vnode.type, 'setup') ||
    hasOwnProperty(vnode.type, 'render') ||
    lodash.isFunction(vnode.type)
  ) {
    return true;
  }

  return false;
}
