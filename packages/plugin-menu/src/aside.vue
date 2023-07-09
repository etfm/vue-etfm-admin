<script setup lang="ts">
  import BasicMenu from './BasicMenu.vue';
  import { useNamespace } from '@etfma/hooks';
  import Trigger from './components/trigger/index.vue';
  import { EtfmaScrollbar } from '@etfma/etfma-ui';
  import { reactive, ref } from 'vue';
  import { lodash } from '@etfma/shared';
  import { event } from '@etfma/core';
  import { useRouter } from 'vue-router';

  defineOptions({
    name: 'LayoutASide',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * 是否横向
     * @default false
     */
    isHorizontal?: boolean;
    /**
     * 布局方式
     * @default side-nav
     */
    layout: string;
    /**
     * 是否折起
     * @default false
     */
    isCollapse: boolean;
  }

  const emit = defineEmits<{ toggle: [collapse: boolean] }>();

  withDefaults(defineProps<Props>(), {
    layout: 'side-nav',
    isHorizontal: false,
    isCollapse: false,
  });

  const { push } = useRouter();

  const ns = useNamespace('layout-menu');

  const model = reactive({
    defaultActive: '',
  });

  const menuRef = ref([
    {
      path: '1',
      name: 'Menu 1',
      children: [
        {
          path: '1.1',
          name: 'Menu 1.1',
          children: [
            {
              path: '1.1.1',
              name: 'Menu 1.1.1',
            },
            {
              path: '1.1.2',
              name: 'Menu 1.1.2',
            },
          ],
        },
        {
          path: '1.2',
          name: 'Menu 1.2',
        },
      ],
    },
    {
      path: '2',
      name: 'Menu 2',
    },
  ]);

  /**
   * 监听当前路由的变化
   */

  event.on('router-change', (menu) => {
    const currentActiveMenu = lodash.get(menu, 'meta.currentActiveMenu') as string;
    if (currentActiveMenu) {
      model.defaultActive = currentActiveMenu;
    } else {
      model.defaultActive = menu.path;
    }
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
    emit('toggle', collapse);
  };
</script>
<template>
  <div :class="[ns.b()]">
    <EtfmaScrollbar class="h-full">
      <BasicMenu
        :collapse="isCollapse"
        :menus="menuRef"
        :is-horizontal="isHorizontal"
        :default-active="model.defaultActive"
        @menu-click="handleClick"
      ></BasicMenu>
    </EtfmaScrollbar>
    <div class="absolute right-5 bottom-3"
      ><Trigger :is-collapse="isCollapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<style scoped lang="scss">
  @include b('layout-menu') {
    position: relative;
    width: 220px;
    height: 100%;
  }
</style>
