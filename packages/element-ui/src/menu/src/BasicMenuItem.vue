<script setup lang="ts">
  import { EtfmaMenuItem } from '@etfma/ui';
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

  withDefaults(defineProps<Props>(), {
    showTitle: true,
  });
</script>

<template>
  <EtfmaMenuItem :index="menu.path">
    <template #title>
      <BasicMenuItemContent :show-title="showTitle" :menu="menu" />
    </template>
  </EtfmaMenuItem>
</template>

<style lang="scss" module></style>
