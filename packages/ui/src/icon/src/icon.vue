<template>
  <i :class="ns.b()" :style="style" v-bind="$attrs">
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
    name: 'EtfmaIcon',
    inheritAttrs: false,
  });
  const props = defineProps(iconProps);
  const ns = useNamespace('icon');

  const style = computed<CSSProperties>(() => {
    const { size, color } = props;
    if (!size && !color) return {};

    return {
      fontSize: lodash.isUndefined(size) ? undefined : addUnit(size),
      '--color': color,
    };
  });
</script>
