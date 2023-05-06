<script setup lang="ts">
  import { ElMenuItem } from 'element-plus';
  import { computed } from 'vue';
  import BasicMenuItemContent from './basic-menu-item-content.vue';

  // 是否显示字迹菜单
  function menuHasChildren(menuTreeItem: MenuType): boolean {
    return (
      !menuTreeItem.meta?.hideChildrenInMenu &&
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 0
    );
  }
</script>

<template>
  <ElMenuItem>
    <BasicMenuItemContent />
  </ElMenuItem>
</template>

<style lang="scss" scoped module></style>
