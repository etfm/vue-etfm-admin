<script setup lang="ts">
  import { ElDivider } from 'element-plus';
  import { BasicDrawer, useDrawerInner } from '@etfma/element-ui';

  const [register] = useDrawerInner();
</script>

<template>
  <BasicDrawer @register="register" title="项目设置">
    <ElDivider> 主题 </ElDivider>

    <ElDivider> 导航栏模式 </ElDivider>

    <ElDivider> 界面功能 </ElDivider>

    <ElDivider> 界面显示 </ElDivider>

    <ElDivider> 动画 </ElDivider>
  </BasicDrawer>
</template>
