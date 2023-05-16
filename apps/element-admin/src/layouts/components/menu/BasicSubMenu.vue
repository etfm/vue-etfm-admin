<script lang="ts" setup>
  import { Menu } from '@/router/types';
  import BasicMenuItem from './BasicMenuItem.vue';
  import { computed } from 'vue';
  import { ElSubMenu } from 'element-plus';

  defineOptions({
    name: 'BasicSubMenu',
  });

  interface Props {
    /**
     * 菜单列表
     * @default Menu
     */
    menu: Menu;
  }

  const props = withDefaults(defineProps<Props>(), {});

  /**
   * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
   */
  const hasChildren = computed(() => {
    const { menu } = props;
    return (
      !menu.meta?.hideChildrenInMenu &&
      Reflect.has(menu, 'children') &&
      !!menu.children &&
      menu.children.length > 0
    );
  });
</script>

<template>
  <BasicMenuItem v-if="!hasChildren" :menu="menu" />
  <ElSubMenu :index="`submenu-${menu.path}`">
    <template v-for="item in menu.children || []" :key="item.path">
      <BasicSubMenu :menu="item"></BasicSubMenu>
    </template>
  </ElSubMenu>
</template>

<style module lang="scss" scoped></style>
