<script setup lang="ts">
  import { BasicMenu, MenuModeEnum } from '@etfm/element-ui';
  import { useNamespace } from '@etfm/hooks';
  import { computed, reactive, ref, watch, onUnmounted } from 'vue';
  import { event, material, type AppRouteRecordRaw } from 'etfm-engine';
  import { useRouter } from 'vue-router';
  import { MenuRecordRaw } from '@etfm/types';
  import { useMenu } from './hooks/use-menu';
  import { TriggerEnum } from './enum';

  defineOptions({
    name: 'PluginHeaderNav',
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
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultActive: '',
    uniqueOpened: true,
    menuTrigger: TriggerEnum.HOVER,
    menus: () => [],
  });

  const { push, currentRoute } = useRouter();

  const ns = useNamespace('header-nav');
  const { getMenu, transformRouteToMenu } = useMenu();

  const model = reactive({
    mode: MenuModeEnum.HORIZONTAL,
    defaultActive: props.defaultActive,
    menus: props.menus,
    uniqueOpened: props.uniqueOpened,
    menuTrigger: props.menuTrigger,
  });

  const menuList = ref<MenuRecordRaw[]>([]);

  watch(
    () => currentRoute.value,
    (router) => {
      model.defaultActive = router.fullPath;
    },
    {
      immediate: true,
    },
  );

  /**
   * 设置是否只保持一个子菜单的展开
   */
  const dispose = event.on('header-nav:menu-trigger', (e: TriggerEnum) => {
    if (model.menuTrigger !== e) {
      model.menuTrigger = e;
    }
  });

  onUnmounted(() => {
    dispose();
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
  });

  const menus = computed(() => menuList.value);

  /**
   * 跳转路由
   * @param path
   */
  function handleClick(path: string) {
    push(path);
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
  @include b('header-nav') {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
