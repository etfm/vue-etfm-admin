<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { EtfmaScrollbar } from '@etfma/ui';
  import { computed, reactive, watch } from 'vue';
  import { event, material, type AppRouteRecordRaw, useRouter, config } from '@etfma/core';
  import { LayoutType, MenuRecordRaw } from '@etfma/types';
  import { useMenu } from './hooks/use-menu';
  import type { CSSProperties } from 'vue';
  import { MixMenu, Trigger } from './components';

  defineOptions({
    name: 'LayoutMixAside',
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
     * 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
     * @default false
     */
    collapse?: boolean;

    /**
     * 菜单的类型
     *  @default side-nav
     */
    type?: LayoutType;
  }

  const props = withDefaults(defineProps<Props>(), {
    collapse: false,
    defaultActive: '',
    uniqueOpened: true,
    type: 'side-mixed-nav',
    menus: () => [],
  });

  const { currentRoute } = useRouter();

  const ns = useNamespace('mix-aside');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    defaultActive: props.defaultActive,
    collapse: props.collapse,
    menus: props.menus,
    uniqueOpened: props.uniqueOpened,
    type: props.type,
    width: 0,
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

  config.onGot('layout', (arg) => {
    model.type = arg;
  });

  config.onGot('layout.sideCollapse', (arg) => {
    model.collapse = !!arg;
  });

  config.onGot('layout.sideCollapseWidth', (arg) => {
    model.width = arg!;
  });

  /**
   * 设置默认激活的index
   */
  event.on('mixAside:default-active', (path: string) => {
    if (model.defaultActive === path) return;

    model.defaultActive = path;
  });

  /**
   * 设置是否只保持一个子菜单的展开
   */
  event.on('mixAside:unique-opened', (e: boolean) => {
    if (model.uniqueOpened !== e) {
      model.uniqueOpened = e;
    }
  });

  /**
   * @description 当只有路由类型 MenuTypeEnum.SPLIT_MENU 时才会赋值路由生效
   */
  event.on('mixAside:routes', (e: MenuRecordRaw[]) => {
    if (model.type === 'side-mixed-nav') {
      model.menus = e;
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
    model.menus = menus;
  });

  /**
   * 折叠
   * @param collapse
   */
  const toggleCollapsed = (collapse: boolean) => {
    config.set('layout.sideCollapse', !collapse);
  };

  const getWrapper = computed<CSSProperties | null>(() => {
    return model.collapse ? { width: `${model.width}px` } : { width: 'calc(100%)' };
  });

  const triggerClass = computed(() => {
    return {
      [ns.e('trigger')]: true,
      [ns.e('collapse')]: model.collapse || model.type === 'side-mixed-nav',
    };
  });
</script>
<template>
  <div :class="[ns.b()]">
    <EtfmaScrollbar :class="ns.e('scrollbar')" :style="getWrapper">
      <MixMenu
        :collapse="model.collapse"
        :menus="model.menus"
        :default-active="model.defaultActive"
      ></MixMenu>
    </EtfmaScrollbar>
    <div :class="triggerClass">
      <Trigger :collapse="model.collapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b('mix-aside') {
    position: relative;
    height: 100%;

    @include e(scrollbar) {
      height: 100%;
    }

    @include e(trigger) {
      position: absolute;
      right: 20px;
      bottom: 12px;
    }

    @include e(collapse) {
      right: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
