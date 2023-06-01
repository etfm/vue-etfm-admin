<script setup lang="ts" module>
  import { Icon } from '@etfma/icons';
  const openDrawer = () => {};
</script>
<template>
  <div @click="openDrawer()">
    <Icon color="#000" icon="ion:settings-outline"></Icon>
    <!-- <SettingDrawer @register="register" /> -->
  </div>
</template>
