import { Comment, Fragment, Text, cloneVNode, defineComponent, inject, withDirectives } from 'vue';
import { lodash, NOOP, loggerDebug } from '@etfm/shared';
import { FORWARD_REF_INJECTION_KEY, useForwardRefDirective, useNamespace } from '@etfm/hooks';

import type { Ref, VNode } from 'vue';

const NAME = 'EtfmOnlyChild';

export const OnlyChild = defineComponent({
  name: NAME,
  setup(_, { slots, attrs }) {
    const forwardRefInjection = inject(FORWARD_REF_INJECTION_KEY);
    const forwardRefDirective = useForwardRefDirective(forwardRefInjection?.setForwardRef ?? NOOP);
    return () => {
      const defaultSlot = slots.default?.(attrs);
      if (!defaultSlot) return null;

      if (defaultSlot.length > 1) {
        loggerDebug(NAME, 'requires exact only one valid child.');
        return null;
      }

      const firstLegitNode = findFirstLegitChild(defaultSlot);
      if (!firstLegitNode) {
        loggerDebug(NAME, 'no valid child node found');
        return null;
      }

      return withDirectives(cloneVNode(firstLegitNode!, attrs), [[forwardRefDirective]]);
    };
  },
});

function findFirstLegitChild(node: VNode[] | undefined): VNode | null {
  if (!node) return null;
  const children = node as VNode[];
  for (const child of children) {
    /**
     * when user uses h(Fragment, [text]) to render plain string,
     * this switch case just cannot handle, when the value is primitives
     * we should just return the wrapped string
     */
    if (lodash.isObject(child)) {
      switch (child.type) {
        case Comment:
          continue;
        case Text:
        case 'svg':
          return wrapTextContent(child);
        case Fragment:
          return findFirstLegitChild(child.children as VNode[]);
        default:
          return child;
      }
    }
    return wrapTextContent(child);
  }
  return null;
}

function wrapTextContent(s: string | VNode) {
  const ns = useNamespace('only-child', { isCssModule: false });
  return <span class={ns.e('content')}>{s}</span>;
}

export type OnlyChildExpose = {
  forwardRef: Ref<HTMLElement>;
};
