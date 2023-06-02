<script setup lang="ts">
  import { ElScrollbar } from 'element-plus';
  import { computed, CSSProperties, reactive } from 'vue';
  import { useLayoutMenu } from './useLayoutMenu';
  import { BasicMenu } from '@etfma/element-ui';
  import { listenerRouteChange } from '@/logics/mitt';
  import { useGo } from '@etfma/router';
  import { lodash } from '@etfma/shared';

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

  const model = reactive({
    defaultActive: '',
  });

  const { menuRef } = useLayoutMenu();

  const go = useGo();

  const getWrapperStyle = computed((): CSSProperties => {
    return {
      height: 'calc(100% - 60px)',
    };
  });

  /**
   * 监听当前路由的变化
   */
  listenerRouteChange((menu) => {
    const currentActiveMenu = lodash.get(menu, 'meta.currentActiveMenu') as string;
    if (currentActiveMenu) {
      model.defaultActive = currentActiveMenu;
    } else {
      model.defaultActive = menu.path;
    }
  });

  /**
   * 跳转路由
   */
  function handleClick(path: string) {
    go(path);
  }
</script>

<template>
  <ElScrollbar :style="getWrapperStyle">
    <BasicMenu
      :collapse="isCollapse"
      :menus="menuRef"
      :is-horizontal="isHorizontal"
      :default-active="model.defaultActive"
      @menu-click="handleClick"
    ></BasicMenu>
  </ElScrollbar>
</template>
