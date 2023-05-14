<script setup lang="ts">
  import { ElMenu } from 'element-plus';
  import BasicSubMenu from './BasicSubMenu.vue';
  import { Menu } from '@/router/types';
  import { reactive, ref, unref } from 'vue';
  import { MenuModeEnum, MenuTypeEnum, Mode } from './enum.js';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import { REDIRECT_NAME } from '@/router/constant';
  import type { RouteLocationNormalized } from '@etfm/vea-router';

  defineOptions({
    name: 'BasicMenu',
  });

  interface Props {
    /**
     * 菜单列表
     * @default Menu[]
     */
    items: Menu[];
    /**
     * 是否横向菜单
     * @default false
     */
    isHorizontal?: boolean;
    /**
     * 菜单组件mode属性
     * @default MenuModeEnum.VERTICAL
     */
    mode?: Mode;
    /**
     * 菜单组件的类型
     * @default MenuTypeEnum.MIX
     */
    type?: MenuTypeEnum;
    /**
     * 是否只保持一个子菜单的展开
     * @default false
     */
    uniqueOpened?: boolean;
    /**
     * 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
     * @default false
     */
    collapse?: boolean;
    /**
     * 是否省略多余的子项（仅在横向模式生效）
     * @default true
     */
    ellipsis?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isHorizontal: false,
    mode: MenuModeEnum.VERTICAL,
    type: MenuTypeEnum.MIX,
    uniqueOpened: false,
    collapse: false,
    ellipsis: true,
  });

  const emits = defineEmits<{}>();

  const menuState = reactive({
    defaultActive: '',
    defaultOpened: [],
  });
  const currentActiveMenu = ref('');

  listenerRouteChange((route) => {
    console.log(route, '============');

    if (route.name === REDIRECT_NAME) return;
    handleMenuChange(route);
    currentActiveMenu.value = route.meta?.currentActiveMenu as string;

    if (unref(currentActiveMenu)) {
      menuState.defaultActive = unref(currentActiveMenu);
      setOpenKeys(unref(currentActiveMenu));
    }
  });

  function setOpenKeys(current: string) {
    console.log(current);
  }

  function handleMenuChange(route: RouteLocationNormalized) {
    console.log(route);
  }

  const handleOpen = (index: string, indexPath: string[]) => {
    console.log(index, indexPath);
  };

  const handleClose = (index: string, indexPath: string[]) => {
    console.log(index, indexPath);
  };
</script>

<template>
  <ElMenu
    default-active="2"
    mode="vertical"
    :default-openeds="[]"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="item in items" :key="item.path">
      <BasicSubMenu :item="item" :isHorizontal="isHorizontal" />
    </template>
  </ElMenu>
</template>

<style scoped lang="scss" module></style>
