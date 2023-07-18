<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@etfma/element-ui';

  const [register] = useDrawerInner();
</script>

<template>
  <BasicDrawer @register="register" title="测试" />
</template>

<style></style>
