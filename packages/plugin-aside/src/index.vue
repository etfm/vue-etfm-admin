<script setup lang="ts">
  import { BasicMenu } from '@etfma/bs-ui';
  import { useNamespace } from '@etfma/hooks';
  import Trigger from './components/trigger/index.vue';
  import { EtfmaScrollbar } from '@etfma/ui';
  import { computed, reactive, watch } from 'vue';
  import { event, material, type AppRouteRecordRaw, useRouter, config } from '@etfma/core';
  import { MenuRecordRaw } from '@etfma/types';
  import { useMenu } from './hooks/use-menu';
  import { MenuTypeEnum } from './enum';
  import type { CSSProperties } from 'vue';

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
     *  @default MenuTypeEnum.MENU
     */
    type?: MenuTypeEnum;
  }

  const props = withDefaults(defineProps<Props>(), {
    collapse: false,
    defaultActive: '',
    uniqueOpened: true,
    type: MenuTypeEnum.ASIDE,
    menus: () => [],
  });

  const { currentRoute, push } = useRouter();

  const ns = useNamespace('pa');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    defaultActive: props.defaultActive,
    collapse: props.collapse,
    menus: props.menus,
    uniqueOpened: props.uniqueOpened,
    type: props.type,
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

  config.onGot('layout', (l: MenuTypeEnum) => {
    model.type = l;
  });

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
  event.on('aside:default-active', (path: string) => {
    if (model.defaultActive === path) return;

    model.defaultActive = path;
  });

  /**
   * 设置是否只保持一个子菜单的展开
   */
  event.on('aside:unique-opened', (e: boolean) => {
    if (model.uniqueOpened !== e) {
      model.uniqueOpened = e;
    }
  });

  /**
   * @description 当只有路由类型 MenuTypeEnum.SPLIT_MENU 时才会赋值路由生效
   */
  event.on('aside:routes', (e: MenuRecordRaw[]) => {
    if (model.type === MenuTypeEnum.MIX) {
      model.menus = e;
    }
  });

  /**
   * 监听路由的变化
   * 菜单是根据路由转化而来
   * 具体参数请查看文档
   */
  material.onChangeAssets('routes', (routes: AppRouteRecordRaw[]) => {
    if (model.type === MenuTypeEnum.MIX) return;
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

  const getWrapper = computed<CSSProperties | null>(() => {
    return model.collapse ? null : { width: '220px' };
  });
</script>
<template>
  <div :class="[ns.b()]">
    <EtfmaScrollbar :class="ns.e('scrollbar')" :viewClass="ns.e('scrollbar')">
      <BasicMenu
        :class="ns.b()"
        :style="getWrapper"
        :collapse="model.collapse"
        :menus="model.menus!"
        :default-active="model.defaultActive"
        :unique-opened="model.uniqueOpened"
        @menu-click="handleClick"
      ></BasicMenu>
    </EtfmaScrollbar>
    <div :class="ns.e('trigger')">
      <Trigger :collapse="model.collapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b('pa') {
    position: relative;
    height: 100%;
    background-color: getCssVar('menu-bg-color');

    @include e(scrollbar) {
      height: 100%;
    }

    @include e(trigger) {
      position: absolute;
      right: 20px;
      bottom: 12px;
    }
  }
</style>
