<script setup lang="ts">
  import { ElMenuItem } from 'element-plus';
  import BasicMenuItemContent from './BasicMenuItemContent.vue';
  import { MenuRecordRaw } from '@etfma/types';

  interface Props {
    /**
     * 菜单项
     */
    menu: MenuRecordRaw;
  }

  const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <ElMenuItem :index="menu.path">
    <template #title>
      <BasicMenuItemContent :menu="menu" />
    </template>
  </ElMenuItem>
</template>

<style lang="scss" scoped module></style>
