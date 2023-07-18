<template>
  <Icon :class="classes" :style="style" icon="material-symbols:arrow-forward-ios" />
</template>

<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { computed, useAttrs } from 'vue';
  import { Icon } from '@etfma/icon';
  import type { IBasicArrow } from './typing';

  const ns = useNamespace('basic-arrow');

  const { style } = useAttrs();

  const props = defineProps<IBasicArrow>();

  const classes = computed(() => {
    const { expand, up, down, inset } = props;
    return [
      ns.b(),
      {
        [`${ns.m('active')}`]: expand,
        up,
        inset,
        down,
      },
    ];
  });
</script>
<style lang="scss" scoped>
  @include b(basic-arrow) {
    display: inline-block;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    @include m(active) {
      transform: rotate(90deg);
    }

    &.inset {
      line-height: 0px;
    }

    &.up {
      transform: rotate(-90deg);
    }

    &.down {
      transform: rotate(90deg);
    }

    &.up.#{$namespace}--active {
      transform: rotate(90deg);
    }

    &.down.#{$namespace}--active {
      transform: rotate(-90deg);
    }
  }
</style>
