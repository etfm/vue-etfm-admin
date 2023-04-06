<template>
  <ElHeader class="header">
    <div class="header-left">
      <!-- 收缩组件 -->
      <HeaderTrigger />
      <!-- 面包屑 -->
      <LayoutBreadcrumb />
    </div>
    <div class="header-right">22</div>
  </ElHeader>
</template>
<script lang="ts" setup>
import { ElHeader } from 'element-plus'
import HeaderTrigger from '../trigger/header-trigger.vue'
import LayoutBreadcrumb from '../components/breadcrumb/layout-breadcrumb.vue'
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  background-color: aqua;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-left {
    display: flex;
    align-items: center;
  }
}
</style>
