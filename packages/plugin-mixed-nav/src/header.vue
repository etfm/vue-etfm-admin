<script setup lang="ts">
  import { BasicMenu, MenuModeEnum } from '@etfm/element-ui';
  import { useNamespace } from '@etfm/hooks';
  import { computed, reactive, ref, unref, watch } from 'vue';
  import { event, material, type AppRouteRecordRaw } from 'etfm-engine';
  import { useRouter } from 'vue-router';
  import { MenuRecordRaw } from '@etfm/types';
  import { useMenu } from './hooks/use-menu';
  import { lodash } from '@etfm/shared';

  defineOptions({
    name: 'MixedNavHeader',
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
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultActive: '',
    type: 'mixed-nav',
    menus: () => [],
  });

  const { push, currentRoute } = useRouter();

  const ns = useNamespace('mixed-nav-header');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    mode: MenuModeEnum.HORIZONTAL,
    defaultActive: props.defaultActive,
    menus: props.menus,
    type: props.type,
  });

  const menuList = ref<MenuRecordRaw[]>([]);

  const menus = computed(() => {
    const list = lodash.cloneDeep(menuList.value);
    return list.map((menu) => {
      delete menu.children;
      return menu;
    });
  });

  watch(
    () => currentRoute.value,
    (router) => {
      const parent = router.matched && !lodash.isEmpty(router.matched) && router.matched[0];
      model.defaultActive = parent ? parent.path : '';
      setSplitMenu(unref(menuList), model.defaultActive);
    },
    {
      immediate: true,
    },
  );

  /**
   * 监听路由的变化
   * 菜单是根据路由转化而来
   * 具体参数请查看文档
   */
  material.onChangeAssets('routes', (routes: AppRouteRecordRaw[]) => {
    const transfromMenus = transformRouteToMenu(routes);
    const menus = getMenu(transfromMenus);

    menuList.value = menus;

    setSplitMenu(menus, model.defaultActive);
  });

  /**
   * 跳转路由
   * @param path
   */
  function handleClick(path: string) {
    setSplitMenu(unref(menuList), path);
  }

  /**
   * 设置菜单
   * @param menus
   * @param path
   */
  function setSplitMenu(menus: MenuRecordRaw[], path: string) {
    const m = menus.find((menu) => menu.path === path);

    if (m && m.children && !lodash.isEmpty(m.children) && lodash.isArray(m.children)) {
      event.emit('mixed-nav:routes', m.children);
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
      :unique-opened="true"
      @menu-click="handleClick"
    />
  </div>
</template>
<style module lang="scss">
  @include b(mixed-nav-header) {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
