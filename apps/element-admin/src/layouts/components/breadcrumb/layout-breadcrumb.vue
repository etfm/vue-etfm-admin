<template>
  <div :class="[ns.b()]">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem><a href="/">Dashboard</a></ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion list</ElBreadcrumbItem>
      <ElBreadcrumbItem>promotion detail</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
</template>
<script setup lang="ts">
  import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';
  import { useNamespace } from '@etfma/hooks';

  const ns = useNamespace('layout-breadcrumd');
</script>
<style scoped lang="scss" module>
  @include b('layout-breadcrumd') {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: getCssVar('bg-color-page');
  }
</style>
