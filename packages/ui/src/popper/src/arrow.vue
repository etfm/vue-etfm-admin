<template>
  <span
    ref="arrowRef"
    :class="[ns.b(), ns.is(effect)]"
    :style="arrowStyle"
    data-popper-arrow
    v-bind="attributes?.popper"
  />
</template>

<script lang="ts" setup>
  import { inject, onBeforeUnmount, watch } from 'vue';
  import { useNamespace } from '@etfm/hooks';
  import { POPPER_CONTENT_INJECTION_KEY } from './constants';
  import { popperArrowProps } from './arrow';

  defineOptions({
    name: 'EtfmaPopperArrow',
    inheritAttrs: false,
  });

  const props = defineProps(popperArrowProps);

  const ns = useNamespace('popper-arrow');
  const { arrowOffset, arrowRef, arrowStyle, effect, attributes } = inject(
    POPPER_CONTENT_INJECTION_KEY,
    undefined,
  )!;

  watch(
    () => props.arrowOffset,
    (val) => {
      arrowOffset.value = val;
    },
  );
  onBeforeUnmount(() => {
    arrowRef.value = undefined;
  });

  defineExpose({
    /**
     * @description Arrow element
     */
    arrowRef,
  });
</script>
<style lang="scss" scoped module>
  @include b(popper-arrow) {
    position: absolute;
    z-index: -1;
    width: 10px;
    height: 10px;

    &::before {
      position: absolute;
      z-index: -1;
      box-sizing: border-box;
      width: 10px;
      height: 10px;
      content: ' ';
      background: getCssVar('text-color', 'primary');
      transform: rotate(45deg);
    }

    $placements: (
      'top': 'bottom',
      'bottom': 'top',
      'left': 'right',
      'right': 'left',
    );

    @each $placement, $opposite in $placements {
      &[data-popper-placement^='#{$placement}'] {
        #{$opposite}: -5px;
        &::before {
          @if $placement == top {
            border-bottom-right-radius: 2px;
          }

          @if $placement == bottom {
            border-top-left-radius: 2px;
          }

          @if $placement == left {
            border-top-right-radius: 2px;
          }

          @if $placement == right {
            border-bottom-left-radius: 2px;
          }
        }
      }
    }

    @each $placement,
      $adjacency in ('top': 'left', 'bottom': 'right', 'left': 'bottom', 'right': 'top')
    {
      &[data-popper-placement^='#{$placement}'] {
        &::before {
          border-#{$placement}-color: transparent !important;
          border-#{$adjacency}-color: transparent !important;
        }
      }
    }

    @include when(dark) {
      &::before {
        right: 0;
        background: getCssVar('text-color', 'primary');
        border: 1px solid getCssVar('text-color', 'primary');
      }
    }

    @include when(light) {
      &::before {
        right: 0;
        background: getCssVar('bg-color', 'overlay');
        border: 1px solid getCssVar('border-color', 'light');
      }
    }
  }
</style>
