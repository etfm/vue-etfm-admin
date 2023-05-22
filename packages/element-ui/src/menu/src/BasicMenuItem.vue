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

  console.log(props);
</script>

<template>
  <ElMenuItem>
    <BasicMenuItemContent :menu="menu" />
  </ElMenuItem>
</template>

<style lang="scss" scoped module></style>
