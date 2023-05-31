<script setup lang="ts">
  import { ElMenuItem } from 'element-plus';
  import BasicMenuItemContent from './BasicMenuItemContent.vue';
  import { MenuRecordRaw } from '@etfma/types';

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

  const props = withDefaults(defineProps<Props>(), {
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

<style lang="scss" scoped module></style>
