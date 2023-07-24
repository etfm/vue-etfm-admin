<script setup lang="ts">
  import { BasicMenu, MenuModeEnum } from '@etfma/bs-ui';
  import { useNamespace } from '@etfma/hooks';
  import { computed, reactive, ref, unref, watch } from 'vue';
  import { event, material, type AppRouteRecordRaw } from '@etfma/core';
  import { useRouter } from 'vue-router';
  import { MenuRecordRaw } from '@etfma/types';
  import { useMenu } from './hooks/use-menu';
  import { MenuTypeEnum, TriggerEnum } from './enum';
  import { lodash } from '@etfma/shared';

  defineOptions({
    name: 'PluginHeaderMenu',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * 页面加载时默认激活菜单的 index
     * @default ''
     */
    defaultActive?: string;

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
     * 子菜单打开的触发方式
     * @default hover
     */
    menuTrigger?: TriggerEnum;

    /**
     * 菜单的类型
     *  @default MenuTypeEnum.MENU
     */
    type?: MenuTypeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultActive: '',
    uniqueOpened: true,
    menuTrigger: TriggerEnum.HOVER,
    type: MenuTypeEnum.MENU,
    menus: () => [],
  });

  const { push, currentRoute } = useRouter();

  const ns = useNamespace('phm');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    mode: MenuModeEnum.HORIZONTAL,
    defaultActive: props.defaultActive,
    menus: props.menus,
    uniqueOpened: props.uniqueOpened,
    menuTrigger: props.menuTrigger,
    type: props.type,
  });

  const menuList = ref<MenuRecordRaw[]>([]);

  watch(
    currentRoute,
    (router) => {
      if (model.type === MenuTypeEnum.SPLIT_MENU) {
        const parent = router.matched && !lodash.isEmpty(router.matched) && router.matched[0];
        model.defaultActive = parent ? parent.path : '';
      } else {
        model.defaultActive = router.fullPath;
      }
    },
    {
      immediate: true,
    },
  );

  /**
   * 设置默认激活的index
   */
  event.on('header-menu:default-active', (path: string) => {
    if (model.defaultActive === path) return;

    model.defaultActive = path;
  });

  /**
   * 设置是否只保持一个子菜单的展开
   */
  event.on('header-menu:unique-opened', (e: boolean) => {
    if (model.uniqueOpened !== e) {
      model.uniqueOpened = e;
    }
  });

  /**
   * 设置是否只保持一个子菜单的展开
   */
  event.on('header-menu:menu-trigger', (e: TriggerEnum) => {
    if (model.menuTrigger !== e) {
      model.menuTrigger = e;
    }
  });

  /**
   * 监听路由的变化
   * 菜单是根据路由转化而来
   * 具体参数请查看文档
   */
  material.onChangeAssets('routes', (routes: AppRouteRecordRaw[]) => {
    const transfromMenus = transformRouteToMenu(routes);
    const menus = getMenu(transfromMenus);

    menuList.value = menus;

    if (model.type === MenuTypeEnum.SPLIT_MENU) {
      setSplitMenu(menuList.value, model.defaultActive);
    }
  });

  const menus = computed(() => {
    const list = lodash.cloneDeep(menuList.value);
    if (model.type === MenuTypeEnum.SPLIT_MENU) {
      return list.map((menu) => {
        delete menu.children;
        return menu;
      });
    } else {
      return list;
    }
  });

  /**
   * 跳转路由
   */
  function handleClick(path: string) {
    if (model.type === MenuTypeEnum.SPLIT_MENU) {
      setSplitMenu(unref(menuList), path);
    } else {
      push(path);
    }
  }

  /**
   * 设置菜单
   */
  function setSplitMenu(menus: MenuRecordRaw[], path: string) {
    const m = menus.find((menu) => menu.path === path);

    if (m && m.children && !lodash.isEmpty(m.children) && lodash.isArray(m.children)) {
      event.emit('aside:routes', m.children);
      return;
    }
    path && push(path);
  }
</script>
<template>
  <div :class="[ns.b()]">
    <BasicMenu
      :mode="model.mode"
      :menus="menus!"
      :default-active="model.defaultActive"
      :unique-opened="model.uniqueOpened"
      @menu-click="handleClick"
    />
  </div>
</template>
<style module lang="scss">
  @include b('phm') {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: getCssVar('menu-bg-color');
  }
</style>
