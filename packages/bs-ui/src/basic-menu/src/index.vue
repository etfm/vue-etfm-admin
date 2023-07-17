<script setup lang="ts">
  import BasicMenu from './BasicMenu.vue';
  import { useNamespace } from '@etfma/hooks';
  import Trigger from './components/trigger/index.vue';
  import { EtfmaScrollbar } from '@etfma/ui';
  import { reactive, watch } from 'vue';
  import { event, material, type AppRouteRecordRaw } from '@etfma/core';
  import { useRouter } from 'vue-router';
  import { MenuModeEnum, Mode } from './enum';
  import { MenuRecordRaw } from '@etfma/types';
  import { useMenu } from './hooks/use-menu';

  defineOptions({
    name: 'LayoutASide',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * 页面加载时默认激活菜单的 index
     * @default ''
     */
    defaultActive?: string;
    /**
     * 菜单组件mode属性
     * @default MenuModeEnum.VERTICAL
     */
    mode?: Mode;
    /**
     * 菜单列表
     * @default MenuRecordRaw[]
     */
    menus?: MenuRecordRaw[];
    /**
     * 是否只保持一个子菜单的展开
     * @default true
     */
    uniqueOpened?: boolean;
    /**
     * 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
     * @default false
     */
    collapse?: boolean;
    /**
     * 是否省略多余的子项（仅在横向模式生效）
     * @default true
     */
    ellipsis?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    collapse: false,
    model: MenuModeEnum.VERTICAL,
    defaultActive: '',
    ellipsis: true,
    uniqueOpened: true,
  });

  const { push, currentRoute } = useRouter();

  const ns = useNamespace('layout-menu');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    defaultActive: props.defaultActive,
    collapse: props.collapse,
    mode: props.model,
    menus: props.menus,
    ellipsis: props.ellipsis,
    uniqueOpened: props.uniqueOpened,
  });

  watch(
    currentRoute,
    (router) => {
      model.defaultActive = router.fullPath;
    },
    {
      immediate: true,
    },
  );

  /**
   * 监听是否折叠
   */
  event.on('aside:collapse', (e: boolean) => {
    if (e != model.collapse) {
      model.collapse = e;
    }
  });

  /**
   * 设置默认激活的index
   */
  event.on('menu:default-active', (path: string) => {
    if (model.defaultActive === path) return;

    model.defaultActive = path;
  });

  /**
   * 设置是否省略多余的子项
   */
  event.on('menu:ellipsis', (e: boolean) => {
    if (model.mode === MenuModeEnum.HORIZONTAL && model.ellipsis !== e) {
      model.ellipsis = e;
    }
  });

  /**
   * 设置是否只保持一个子菜单的展开
   */
  event.on('menu:unique-opened', (e: boolean) => {
    if (model.uniqueOpened !== e) {
      model.uniqueOpened = e;
    }
  });

  /**
   * 监听路由的变化
   * 菜单是根据菜单转化而来
   * 具体参数请查看文档
   */
  material.onChangeAssets('routes', (routes: AppRouteRecordRaw[]) => {
    const transfromMenus = transformRouteToMenu(routes);
    const menus = getMenu(transfromMenus);

    model.menus = menus;
  });

  /**
   * 跳转路由
   */
  function handleClick(path: string) {
    push(path);
  }

  /**
   * 折叠
   * @param collapse
   */
  const toggleCollapsed = (collapse: boolean) => {
    event.emit('aside:collapse', !collapse);
  };
</script>
<template>
  <div :class="[ns.b()]">
    <EtfmaScrollbar class="h-full">
      <BasicMenu
        :collapse="model.collapse"
        :menus="model.menus!"
        :default-active="model.defaultActive"
        :mode="model.mode"
        :unique-opened="model.uniqueOpened"
        :ellipsis="model.ellipsis"
        @menu-click="handleClick"
      ></BasicMenu>
    </EtfmaScrollbar>
    <div class="absolute right-5 bottom-3"
      ><Trigger :collapse="model.collapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style scoped lang="scss">
  @include b('layout-menu') {
    position: relative;
    height: 100%;
    background-color: getCssVar('menu-bg-color');
  }
</style>
