<script lang="ts" setup>
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'TabPane',
  });

  interface Props {
    /**
     * key
     * @default ''
     */
    key: string | number;
  }

  withDefaults(defineProps<Props>(), {});

  const ns = useNamespace('tab-pane');
</script>

<template>
  <div ref="btnRefs" :class="[ns.b('tag')]" :key="key">
    <slot />
  </div>
</template>
<style scoped lang="scss">
  @include b(tabs-tag) {
    margin: 4px 3px;
    cursor: pointer;
  }
</style>
