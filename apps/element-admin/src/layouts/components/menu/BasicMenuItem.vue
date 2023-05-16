<script setup lang="ts">
  import { ElMenuItem } from 'element-plus';
  import BasicMenuItemContent from './BasicMenuItemContent.vue';
  import { Menu } from '@/router/types';

  interface Props {
    /**
     * 菜单项
     */
    menu: Menu;
  }

  const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <ElMenuItem>
    <BasicMenuItemContent :menu="props.menu" />
  </ElMenuItem>
</template>

<style lang="scss" scoped module></style>
