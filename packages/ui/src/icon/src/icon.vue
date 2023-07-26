<template>
  <i :class="[ns.b(), loading ? ns.is('loading') : '']" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { addUnit, lodash } from '@etfma/shared';
  import { useNamespace } from '@etfma/hooks';
  import { iconProps } from './icon';
  import type { CSSProperties } from 'vue';

  defineOptions({
    name: 'EtfmIcon',
    inheritAttrs: false,
  });
  const props = defineProps(iconProps);
  const ns = useNamespace('icon', { isCssModule: false });

  const style = computed<CSSProperties>(() => {
    const { size, color } = props;
    if (!size && !color) return {};

    return {
      fontSize: lodash.isUndefined(size) ? undefined : addUnit(size),
      '--color': color,
    };
  });
</script>
<style lang="scss" scoped>
  @keyframes rotating {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }

  @include b(icon) {
    --color: inherit;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    font-size: inherit;
    line-height: 1em;
    color: var(--color);
    fill: currentcolor;

    @include when(loading) {
      animation: rotating 2s linear infinite;
    }

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
