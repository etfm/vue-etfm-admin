<script setup lang="ts">
  import { ElScrollbar } from 'element-plus';
  import { computed, CSSProperties } from 'vue';
  import { useLayoutMenu } from './useLayoutMenu';
  import { BasicMenu } from '@etfma/element-ui';

  defineOptions({
    name: 'LayoutMenu',
  });

  interface Props {
    /**
     * 是否横向
     * @default false
     */
    isHorizontal?: boolean;
    /**
     * 是否折起
     * @default false
     */
    isCollapse: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isHorizontal: false,
    isCollapse: false,
  });

  const { menuRef } = useLayoutMenu();

  const getWrapperStyle = computed((): CSSProperties => {
    return {
      height: 'calc(100% - 60px)',
    };
  });
</script>

<template>
  <ElScrollbar :style="getWrapperStyle">
    <BasicMenu :collapse="isCollapse" :menus="menuRef" :is-horizontal="isHorizontal"></BasicMenu>
  </ElScrollbar>
</template>
