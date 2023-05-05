<script setup lang="ts">
  import { ElScrollbar } from 'element-plus';
  import { computed, CSSProperties, watch } from 'vue';
  import BasicMenu from '../components/menu/basic-menu.vue';
  import { usePermissionStore } from '@/store/permission';

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

  const permissionStore = usePermissionStore();

  watch(
    [() => permissionStore.getMenuList],
    () => {
      console.log('============================');

      genMenus();
    },
    {
      immediate: true,
    },
  );

  function genMenus() {}

  const getWrapperStyle = computed((): CSSProperties => {
    return {
      height: `calc(100% - 48px)`,
    };
  });
</script>

<template>
  <ElScrollbar :style="{ getWrapperStyle }">
    <BasicMenu></BasicMenu>
  </ElScrollbar>
</template>
