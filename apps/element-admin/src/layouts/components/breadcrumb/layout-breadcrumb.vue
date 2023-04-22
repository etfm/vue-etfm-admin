<template>
  <div class="layout-breadcrumd">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem><a href="/">Dashboard</a></ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion list</ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion detail</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
</template>
<script setup lang="ts">
  import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';
</script>
<style scoped lang="scss" module>
  .layout-breadcrumd {
    padding: 0 8px;
  }
</style>
