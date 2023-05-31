<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';
  defineOptions({ name: 'EtfmaLayoutBreadcrumb' });
  interface Props {
    /**
     * zIndex
     * @default 0
     */
    zIndex?: number;
    /**
     * 背景颜色
     */
    backgroundColor: string;
    /**
     * 高度
     * @default 56
     */
    height?: number;
    /**
     * 是否固定在顶部
     * @default true
     */
    fixed?: boolean;
    /**
     * top 值
     * @default header+tab高度
     */
    top?: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    zIndex: 0,
    height: 56,
    fixed: true,
    top: 0,
  });
  const { b, e } = useNamespace('breadcrumb');
  const hiddenStyle = computed((): CSSProperties => {
    const { height, zIndex, top, fixed } = props;
    return {
      top: `${top}px`,
      height: `${height}px`,
      zIndex,
      display: fixed ? 'flex' : 'none',
    };
  });
  const style = computed((): CSSProperties => {
    const { backgroundColor, fixed } = props;
    return {
      ...hiddenStyle.value,
      position: fixed ? 'fixed' : 'static',
      display: 'flex',
      backgroundColor,
    };
  });
</script>

<template>
  <div :class="e('hide')" :style="hiddenStyle"></div>
  <section :class="b()" :style="style">
    <slot></slot>
  </section>
</template>

<style scoped module lang="scss">
  @include b('breadcrumb') {
    width: 100%;
    transition: all 0.3s ease 0s;
    @include e('hide') {
      background: transparent;
    }
  }
</style>
