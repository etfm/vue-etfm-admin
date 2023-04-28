<script setup lang="ts">
  import { ElMenu } from 'element-plus';
  import BasicSubMenuItem from './basic-sub-menu-item.vue';

  defineOptions({
    name: 'BasicMenu',
  });

  const handleOpen = (index: string, indexPath: string[]) => {
    console.log(index, indexPath);
  };

  const handleClose = (index: string, indexPath: string[]) => {
    console.log(index, indexPath);
  };
</script>

<template>
  <ElMenu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="item in items" :key="item.path">
      <BasicSubMenuItem :item="item" :theme="theme" :isHorizontal="isHorizontal" />
    </template>
  </ElMenu>
</template>

<style scoped lang="scss" module></style>
