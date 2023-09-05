<template>
  <etfma-only-child
    v-if="!virtualTriggering"
    v-bind="$attrs"
    :aria-controls="ariaControls"
    :aria-describedby="ariaDescribedby"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
  >
    <slot />
  </etfma-only-child>
</template>

<script lang="ts" setup>
  import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue';
  import { EtfmaOnlyChild } from '../../slot';
  import { POPPER_INJECTION_KEY } from './constants';
  import { lodash } from '@etfm/shared';
  import { useForwardRef } from '@etfm/hooks';
  import type { WatchStopHandle } from 'vue';
  import { popperTriggerProps } from './trigger';
  import { unrefElement } from '@vueuse/core';

  defineOptions({
    name: 'EtfmaPopperTrigger',
    inheritAttrs: false,
  });

  const props = defineProps(popperTriggerProps);

  const { role, triggerRef } = inject(POPPER_INJECTION_KEY, undefined)!;

  useForwardRef(triggerRef);

  const ariaControls = computed<string | undefined>(() => {
    return ariaHaspopup.value ? props.id : undefined;
  });

  const ariaDescribedby = computed<string | undefined>(() => {
    if (role && role.value === 'tooltip') {
      return props.open && props.id ? props.id : undefined;
    }
    return undefined;
  });

  const ariaHaspopup = computed<string | undefined>(() => {
    if (role && role.value !== 'tooltip') {
      return role.value;
    }
    return undefined;
  });

  const ariaExpanded = computed<string | undefined>(() => {
    return ariaHaspopup.value ? `${props.open}` : undefined;
  });

  let virtualTriggerAriaStopWatch: WatchStopHandle | undefined = undefined;

  onMounted(() => {
    watch(
      () => props.virtualRef,
      (virtualEl) => {
        if (virtualEl) {
          triggerRef.value = unrefElement(virtualEl as HTMLElement);
        }
      },
      {
        immediate: true,
      },
    );

    watch(
      triggerRef,
      (el, prevEl) => {
        virtualTriggerAriaStopWatch?.();
        virtualTriggerAriaStopWatch = undefined;
        if (lodash.isElement(el)) {
          (
            [
              'onMouseenter',
              'onMouseleave',
              'onClick',
              'onKeydown',
              'onFocus',
              'onBlur',
              'onContextmenu',
            ] as const
          ).forEach((eventName) => {
            const handler = props[eventName];
            if (handler) {
              (el as HTMLElement).addEventListener(eventName.slice(2).toLowerCase(), handler);
              (prevEl as HTMLElement)?.removeEventListener?.(
                eventName.slice(2).toLowerCase(),
                handler,
              );
            }
          });
          virtualTriggerAriaStopWatch = watch(
            [ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded],
            (watches) => {
              ['aria-controls', 'aria-describedby', 'aria-haspopup', 'aria-expanded'].forEach(
                (key, idx) => {
                  lodash.isNil(watches[idx])
                    ? (el as HTMLElement)?.removeAttribute(key)
                    : (el as HTMLElement)?.setAttribute(key, watches[idx]!);
                },
              );
            },
            { immediate: true },
          );
        }
        if (lodash.isElement(prevEl)) {
          ['aria-controls', 'aria-describedby', 'aria-haspopup', 'aria-expanded'].forEach((key) =>
            (prevEl as HTMLElement)?.removeAttribute(key),
          );
        }
      },
      {
        immediate: true,
      },
    );
  });

  onBeforeUnmount(() => {
    virtualTriggerAriaStopWatch?.();
    virtualTriggerAriaStopWatch = undefined;
  });

  defineExpose({
    /**
     * @description trigger element
     */
    triggerRef,
  });
</script>
