<script setup lang="ts">
  import { ElMenu, useNamespace } from 'element-plus';
  import BasicSubMenu from './BasicSubMenu.vue';
  import type { MenuRecordRaw } from '@etfma/types';
  import { MenuModeEnum, MenuTypeEnum, Mode } from './enum';
  import { reactive, ref, unref } from 'vue';
  import { listenerRouteChange } from './mitt';

  defineOptions({
    name: 'BasicMenu',
  });

  interface Props {
    /**
     * 菜单列表
     * @default MenuRecordRaw[]
     */
    menus: MenuRecordRaw[];
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

  const ns = useNamespace('basic-menu');

  const menuState = reactive({
    defaultActive: '',
    defaultOpened: [],
  });
  const currentActiveMenu = ref('');

  listenerRouteChange((menu) => {
    handleMenuChange(menu);
    currentActiveMenu.value = menu.meta?.currentActiveMenu as string;

    if (unref(currentActiveMenu)) {
      menuState.defaultActive = unref(currentActiveMenu);
      setOpenKeys(unref(currentActiveMenu));
    }
  });

  function setOpenKeys(current: string) {
    console.log(current);
  }

  function handleMenuChange(menu: MenuRecordRaw) {
    console.log(menu);
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
    :class="[ns.b()]"
    :mode="props.mode"
    :default-active="menuState.defaultActive"
    :default-openeds="menuState.defaultOpened"
    :unique-opened="props.uniqueOpened"
    :collapse="collapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="item in menus" :key="item.path">
      <BasicSubMenu :menu="item" :isHorizontal="isHorizontal" />
    </template>
  </ElMenu>
</template>

<style scoped lang="scss">
  @include b('basic-menu') {
    width: 100%;
    border-right: none;
  }
</style>
