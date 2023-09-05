<script lang="ts" setup>
  import type { MenuRecordRaw } from '@etfm/types';
  import BasicMenuItem from './BasicMenuItem.vue';
  import { computed } from 'vue';
  import { EtfmaSubMenu } from '@etfma/ui';
  import BasicMenuItemContent from './BasicMenuItemContent.vue';

  defineOptions({
    name: 'BasicSubMenu',
  });

  interface Props {
    /**
     * 菜单列表
     * @default MenuRecordRaw
     */
    menu: MenuRecordRaw;
    /**
     * 是否显示标题
     * @default true
     */
    showTitle?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showTitle: true,
  });

  /**
   * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
   */
  const hasChildren = computed(() => {
    const { menu } = props;
    return (
      !menu.meta?.hideChildrenMenu &&
      Reflect.has(menu, 'children') &&
      !!menu.children &&
      menu.children.length > 0
    );
  });
</script>

<template>
  <BasicMenuItem v-if="!hasChildren" :menu="menu" :show-title="showTitle" />
  <EtfmaSubMenu v-else :index="menu.path">
    <template #title>
      <BasicMenuItemContent :show-title="showTitle" :menu="menu"></BasicMenuItemContent>
    </template>
    <template v-for="item in menu.children || []" :key="item.path">
      <BasicSubMenu :menu="item"></BasicSubMenu>
    </template>
  </EtfmaSubMenu>
</template>

<style lang="scss" scoped></style>
