<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';
  defineOptions({ name: 'VbenLayoutTab' });
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
     * @default 30
     */
    height?: number;
    /**
     * 是否固定在顶部
     * @default true
     */
    fixed?: boolean;
    /**
     * top 值
     * @default header高度
     */
    top?: number;
    /**
     * left 值
     * @default 180
     */
    left?: number;
    /**
     * 全屏
     * @default false
     */
    fullContent?: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    zIndex: 0,
    height: 30,
    fixed: true,
    top: 0,
    left: 180,
    fullContent: false,
  });
  const { b, e } = useNamespace('tab');
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
    const { backgroundColor, fixed, fullContent, left } = props;
    const widthValue = fixed && !fullContent ? `calc(100% - ${left}px)` : undefined;
    return {
      ...hiddenStyle.value,
      position: fixed ? 'fixed' : 'static',
      display: 'flex',
      backgroundColor,
      width: widthValue,
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
  @include b('tab') {
    width: 100%;
    transition: all 0.3s ease 0s;

    @include e('hide') {
      flex: 0 0 auto;
      width: 100%;
      background: transparent;
    }
  }
</style>
