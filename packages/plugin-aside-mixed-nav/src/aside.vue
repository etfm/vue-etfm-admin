<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { EtfmaScrollbar } from '@etfma/ui';
  import { computed, reactive, watch } from 'vue';
  import { material, type AppRouteRecordRaw, useRouter, config, event } from '@etfma/core';
  import { MenuRecordRaw } from '@etfma/types';
  import { useMenu } from './hooks/use-menu';
  import type { CSSProperties } from 'vue';
  import { MixMenu, Trigger } from './components';
  import { lodash } from '@etfma/shared';

  defineOptions({
    name: 'AsideMixedNavAside',
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

  const ns = useNamespace('aside-mixed-nav-aside');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    defaultActive: props.defaultActive,
    collapse: props.collapse,
    menus: props.menus,
    width: 0,
  });

  const getWrapper = computed<CSSProperties | null>(() => {
    return model.collapse ? { width: `${model.width}px` } : { width: 'calc(100%)' };
  });

  watch(
    [() => currentRoute.value, () => model.menus],
    ([router]) => {
      const parent = router.matched && !lodash.isEmpty(router.matched) && router.matched[0];
      model.defaultActive = parent ? parent.path : '';
      setSplitMenu(model.menus, model.defaultActive);
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

  /**
   * 发送二级菜单
   * @param menus
   */
  function handleClick(menus: MenuRecordRaw[]) {
    event.emit('side-mixed-nav:routes', menus);
  }

  /**
   * 设置菜单
   * @param menus
   * @param path
   */
  function setSplitMenu(menus: MenuRecordRaw[], path: string) {
    const m = menus.find((menu) => menu.path === path);

    if (m && m.children && !lodash.isEmpty(m.children) && lodash.isArray(m.children)) {
      event.emit('side-mixed-nav:routes', m.children);
      return;
    }
    path && push(path);
  }
</script>
<template>
  <div :class="[ns.b()]">
    <EtfmaScrollbar :class="ns.e('scrollbar')" :style="getWrapper">
      <MixMenu
        :collapse="model.collapse"
        :menus="model.menus"
        :default-active="model.defaultActive"
        @click="handleClick"
      ></MixMenu>
    </EtfmaScrollbar>
    <div :class="ns.e('trigger')">
      <Trigger :collapse="model.collapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b('aside-mixed-nav-aside') {
    position: relative;
    height: 100%;

    @include e(scrollbar) {
      height: 100%;
    }

    @include e(trigger) {
      position: absolute;
      bottom: 12px;
      right: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
