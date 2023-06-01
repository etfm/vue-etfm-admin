<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';

  defineOptions({ name: 'EtfmLayoutHeader' });

  interface Props {
    /**
     * 是否显示
     * @default true
     */
    show?: boolean;
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
     * @default 60
     */
    height?: number;
    /**
     * 是否固定在顶部
     * @default true
     */
    fixed?: boolean;
    /**
     * 横屏
     * @default false
     */
    fullWidth?: boolean;
    /**
     * left 值
     * @default 180
     */
    left?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    show: true,
    zIndex: 0,
    height: 60,
    fixed: true,
    left: 180,
  });

  const { b, e } = useNamespace('header');

  const hiddenHeaderStyle = computed((): CSSProperties => {
    const { height, show, fixed } = props;
    const heightValue = `${height}px`;
    return {
      marginTop: show ? 0 : `-${heightValue}`,
      height: heightValue,
      lineHeight: heightValue,
      display: fixed ? 'flex' : 'none',
    };
  });

  const style = computed((): CSSProperties => {
    const { backgroundColor, height, fixed, zIndex, show, fullWidth, left } = props;
    const right = !show || !fullWidth ? undefined : 0;
    const widthValue = fixed && !fullWidth ? `calc(100% - ${left}px)` : undefined;
    return {
      position: fixed ? 'fixed' : 'static',
      marginTop: show ? 0 : `-${height}px`,
      backgroundColor,
      height: `${height}px`,
      width: widthValue,
      zIndex,
      right,
    };
  });
</script>

<template>
  <div :style="hiddenHeaderStyle" :class="e('hide')"></div>
  <header :style="style" :class="b()">
    <slot></slot>
  </header>
</template>

<style scoped module lang="scss">
  @include b('header') {
    top: 0;
    width: 100%;
    transition: all 0.3s ease 0s;

    @include e('hide') {
      flex: 0 0 auto;
      width: 100%;
      background: transparent;
      transition: all 0.3s ease 0s;
    }
  }
</style>
