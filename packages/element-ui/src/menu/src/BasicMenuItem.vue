<script setup lang="ts">
  import { ElMenuItem } from 'element-plus';
  import BasicMenuItemContent from './BasicMenuItemContent.vue';
  import { MenuRecordRaw } from '@etfm/types';

  interface Props {
    /**
     * 菜单项
     * @default []
     */
    menu: MenuRecordRaw;
    /**
     * 是否显示标题
     * @default true
     */
    showTitle?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    showTitle: true,
  });
</script>

<template>
  <ElMenuItem :index="menu.path">
    <template #title>
      <BasicMenuItemContent :show-title="showTitle" :menu="menu" />
    </template>
  </ElMenuItem>
</template>

<style lang="scss" scoped></style>
