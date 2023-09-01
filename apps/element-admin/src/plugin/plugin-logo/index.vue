<script setup lang="ts">
  import { CSSProperties, computed, ref } from 'vue';
  import { useNamespace } from '@etfma/hooks';
  import { config } from '@etfma/core';
  import { LayoutType } from '@etfma/types';

  defineOptions({
    name: 'AppLogo',
    inheritAttrs: false,
  });

  interface Props {
    isBorder?: boolean;
    isTitle?: boolean;
    layout?: LayoutType;
  }

  const props = withDefaults(defineProps<Props>(), {
    isBorder: true,
    isTitle: true,
  });

  const ns = useNamespace('app-logo');

  const title = ref('Etfm Admin');

  const height = ref(0);
  const width = ref(0);

  config.onGot('layout.headerHeight', (h) => {
    height.value = h;
  });

  config.onGot('layout.sideWidth', (w) => {
    width.value = w;
  });

  const getWidth = computed(() => {
    if (props.layout === 'side-mixed-nav' || props.layout === 'side-nav') {
      return '100%';
    } else {
      return `${width.value}px`;
    }
  });

  const style = computed<CSSProperties>(() => {
    return {
      height: `${height.value}px`,
      width: getWidth.value,
      borderBottom: props.isBorder ? '1px solid rgba(29, 35, 41, 0.1)' : 'none',
    };
  });

  const handleGoHome = () => {};
</script>
<template>
  <div :class="[ns.b()]" :style="style" @click="handleGoHome">
    <img style="height: 48px" src="@/assets/images/logo.png" />

    <div v-if="isTitle" :class="[ns.e('title')]">
      {{ title }}
    </div>
  </div>
</template>

<style scoped lang="scss" module>
  @include b(app-logo) {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    @include e(title) {
      overflow: hidden;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
      color: #0960bd;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.5s;
    }
  }
</style>
