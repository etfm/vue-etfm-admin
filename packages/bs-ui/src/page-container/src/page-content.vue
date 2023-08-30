<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { computed, type CSSProperties } from 'vue';

  const { b } = useNamespace('page-content');

  interface Props {
    showHeader?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showHeader: true,
  });

  const style = computed<CSSProperties>(() => {
    return {
      paddingBlockStart: props.showHeader ? 0 : '20px',
      paddingBlockEnd: '20px',
      paddingInline: '20px',
    };
  });
</script>

<template>
  <div :class="b()" :style="style">
    <slot></slot>
  </div>
</template>
<style lang="scss" module>
  @include b(page-content) {
  }
</style>
