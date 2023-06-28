import { computed, ref, unref } from 'vue';
import { useNamespace, useZIndex } from '@etfma/hooks';

import type { CSSProperties, StyleValue } from 'vue';
import type { UsePopperReturn } from './index';
import type { UsePopperContentReturn } from './use-content';

export const usePopperContentDOM = (
  props: any,
  {
    attributes,
    styles,
    role,
  }: Pick<UsePopperReturn, 'attributes' | 'styles'> & Pick<UsePopperContentReturn, 'role'>,
) => {
  const { nextZIndex } = useZIndex();
  const ns = useNamespace('popper');

  const contentAttrs = computed(() => unref(attributes).popper);
  const contentZIndex = ref<number>(props.zIndex || nextZIndex());
  const contentClass = computed(() => [
    ns.b(),
    ns.is('pure', props.pure),
    ns.is(props.effect),
    props.popperClass,
  ]);
  const contentStyle = computed<StyleValue[]>(() => {
    return [
      { zIndex: unref(contentZIndex) } as CSSProperties,
      unref(styles).popper as CSSProperties,
      props.popperStyle || {},
    ];
  });
  const ariaModal = computed<string | undefined>(() =>
    role.value === 'dialog' ? 'false' : undefined,
  );
  const arrowStyle = computed(() => (unref(styles).arrow || {}) as CSSProperties);

  const updateZIndex = () => {
    contentZIndex.value = props.zIndex || nextZIndex();
  };

  return {
    ariaModal,
    arrowStyle,
    contentAttrs,
    contentClass,
    contentStyle,
    contentZIndex,

    updateZIndex,
  };
};

export type UsePopperContentDOMReturn = ReturnType<typeof usePopperContentDOM>;
