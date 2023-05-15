<script setup lang="ts">
  import { ElMenuItem } from 'element-plus';
  import { computed } from 'vue';
  import BasicMenuItemContent from './BasicMenuItemContent.vue.js';
import { Menu } from '@/router/types';

  interface Props {
    /**
     * 菜单项
     */
    menuItem: Menu;
  }


const props = withDefaults(defineProps<Props>(), {})

  /**
   * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
   */
  const hasChildren = computed(() => {
    return !menuTreeItem.meta?.hideChildrenInMenu &&
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 0
  })
</script>

<template>
  <ElMenuItem>
    <BasicMenuItemContent />
  </ElMenuItem>
</template>

<style lang="scss" scoped module></style>
