<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({ name: 'EtfmLayoutContent' });

  interface Props {
    /**
     * padding
     * @default 16
     */
    padding?: number;
    /**
     * paddingBottom
     * @default 16
     */
    paddingBottom?: number;
    /**
     * paddingTop
     * @default 16
     */
    paddingTop?: number;
    /**
     * paddingLeft
     * @default 16
     */
    paddingLeft?: number;
    /**
     * paddingRight
     * @default 16
     */
    paddingRight?: number;
    /**
     * 背景颜色
     */
    backgroundColor: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    padding: 16,
    paddingBottom: 16,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  });

  const ns = useNamespace('content');

  const style = computed((): CSSProperties => {
    const { padding, paddingBottom, paddingTop, paddingLeft, paddingRight, backgroundColor } =
      props;
    return {
      padding: `${padding}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingTop: `${paddingTop}px`,
      paddingLeft: `${paddingLeft}px`,
      paddingRight: `${paddingRight}px`,
      backgroundColor,
    };
  });
</script>

<template>
  <main :style="style" :class="[ns.b()]">
    <slot></slot>
  </main>
</template>
<style scoped lang="scss" module>
  @include b('content') {
    flex: auto;
    height: 100%;
  }
</style>
