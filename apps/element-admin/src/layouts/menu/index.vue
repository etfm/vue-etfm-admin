<script setup lang="ts">
  import { ElScrollbar } from 'element-plus';
  import { computed, CSSProperties } from 'vue';
  import BasicMenu from '../components/menu/basic-menu.vue';
  import { useLayoutMenu } from './useLayoutMenu';

  defineOptions({
    name: 'LayoutMenu',
  });

  interface Props {
    /**
     * 是否横向
     * @default false
     */
    isHorizontal?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isHorizontal: false,
  });

  const { menuRef } = useLayoutMenu();

  const getWrapperStyle = computed((): CSSProperties => {
    return {
      height: `calc(100% - 48px)`,
    };
  });
</script>

<template>
  <ElScrollbar :style="{ getWrapperStyle }">
    <BasicMenu :items="menuRef" :is-horizontal="isHorizontal"></BasicMenu>
  </ElScrollbar>
</template>
