<script setup lang="ts">
  import { BasicMenu } from '@etfma/bs-ui';
  import { useNamespace } from '@etfma/hooks';
  import { EtfmaScrollbar } from '@etfma/ui';
  import { computed, onUnmounted, reactive, watch } from 'vue';
  import { event, useRouter, config } from '@etfma/core';
  import { MenuRecordRaw } from '@etfma/types';
  import type { CSSProperties } from 'vue';
  import { Trigger } from './components';

  defineOptions({
    name: 'AsideMixedNavExtra',
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

  const ns = useNamespace('side-mixed-nav-extra');

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

  const disposeUniqueOpened = event.on('side-mixed-nav:unique-opened', (e: boolean) => {
    if (model.uniqueOpened !== e) {
      model.uniqueOpened = e;
    }
  });

  const disposeRouters = event.on('side-mixed-nav:routes', (e: MenuRecordRaw[]) => {
    model.menus = e;
  });

  onUnmounted(() => {
    disposeUniqueOpened();
    disposeRouters();
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
    <EtfmaScrollbar :class="ns.e('scrollbar')" :style="getWrapper">
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
    <div :class="triggerClass">
      <Trigger :collapse="model.collapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b('side-mixed-nav-extra') {
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