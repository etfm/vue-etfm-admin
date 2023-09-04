<script setup lang="ts">
  import { BasicMenu } from '@etfma/bs-ui';
  import { useNamespace } from '@etfma/hooks';
  import { EtfmaScrollbar } from '@etfma/ui';
  import { onUnmounted, reactive, watch } from 'vue';
  import { event, useRouter } from '@etfma/core';
  import { MenuRecordRaw } from '@etfma/types';

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
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultActive: '',
    uniqueOpened: true,
    menus: () => [],
  });

  const { currentRoute, push } = useRouter();

  const ns = useNamespace('side-mixed-nav-extra');

  const model = reactive({
    defaultActive: props.defaultActive,
    menus: props.menus,
    uniqueOpened: props.uniqueOpened,
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
</script>
<template>
  <div :class="[ns.b()]">
    <EtfmaScrollbar :class="ns.e('scrollbar')">
      <BasicMenu
        :class="ns.b()"
        :menus="model.menus!"
        :default-active="model.defaultActive"
        :unique-opened="model.uniqueOpened"
        @menu-click="handleClick"
      ></BasicMenu>
    </EtfmaScrollbar>
  </div>
</template>
<style lang="scss" module>
  @include b('side-mixed-nav-extra') {
    position: relative;
    height: 100%;
    width: calc(100%);

    @include e(scrollbar) {
      height: 100%;
      width: calc(100%);
    }
  }
</style>
