<script setup lang="ts">
  import { BasicMenu } from '@etfm/element-ui';
  import { useNamespace } from '@etfm/hooks';
  import { ElScrollbar } from 'element-plus';
  import { computed, reactive, watch, onUnmounted } from 'vue';
  import { event, material, type AppRouteRecordRaw, useRouter, config } from 'etfm-engine';
  import { MenuRecordRaw } from '@etfm/types';
  import { useMenu } from './hooks/use-menu';
  import type { CSSProperties } from 'vue';
  import { Trigger } from './components';

  defineOptions({
    name: 'AsideNav',
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
  }

  const props = withDefaults(defineProps<Props>(), {
    collapse: false,
    defaultActive: '',
    uniqueOpened: true,
    menus: () => [],
  });

  const { currentRoute, push } = useRouter();

  const ns = useNamespace('aside-nav');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    defaultActive: props.defaultActive,
    collapse: props.collapse,
    menus: props.menus,
    uniqueOpened: props.uniqueOpened,
    width: 0,
  });

  const getWrapper = computed<CSSProperties | null>(() => {
    return model.collapse ? { width: `${model.width}px` } : { width: 'calc(100%)' };
  });

  const triggerClass = computed(() => {
    return {
      [ns.e('trigger')]: true,
      [ns.e('collapse')]: model.collapse,
    };
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

  config.onGot('layout.sideCollapse', (arg) => {
    model.collapse = !!arg;
  });

  config.onGot('layout.sideCollapseWidth', (arg) => {
    model.width = arg!;
  });

  const dispose = event.on('aside-nav:unique-opened', (e: boolean) => {
    if (model.uniqueOpened !== e) {
      model.uniqueOpened = e;
    }
  });

  material.onChangeAssets('routes', (routes: AppRouteRecordRaw[]) => {
    const transfromMenus = transformRouteToMenu(routes);
    const menus = getMenu(transfromMenus);
    model.menus = menus;
  });

  onUnmounted(() => {
    dispose();
  });

  /**
   * 跳转路由
   * @param path
   */
  function handleClick(path: string) {
    push(path);
  }

  /**
   * 折叠
   * @param collapse
   */
  const toggleCollapsed = (collapse: boolean) => {
    config.set('layout.sideCollapse', !collapse);
  };
</script>
<template>
  <div :class="[ns.b()]">
    <ElScrollbar :class="ns.e('scrollbar')" :style="getWrapper">
      <BasicMenu
        :class="ns.b()"
        :style="getWrapper"
        :collapse="model.collapse"
        :menus="model.menus!"
        :default-active="model.defaultActive"
        :unique-opened="model.uniqueOpened"
        @menu-click="handleClick"
      ></BasicMenu>
    </ElScrollbar>
    <div :class="triggerClass">
      <Trigger :collapse="model.collapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b('aside-nav') {
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
