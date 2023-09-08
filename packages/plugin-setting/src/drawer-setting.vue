<script setup lang="ts">
  import { ElDivider } from 'element-plus';
  import { BasicDrawer, useDrawerInner } from '@etfm/element-ui';
  import DarkMode from './components/dark-mode/index.vue';
  import ColorPicker from './components/color-mode/index.vue';
  import TypePicker from './components/type-picker/index.vue';

  const [register] = useDrawerInner();
</script>

<template>
  <BasicDrawer @register="register" title="项目设置" append-to-body>
    <ElDivider> 主题 </ElDivider>
    <DarkMode />

    <ElDivider> 系统主题 </ElDivider>
    <ColorPicker />

    <ElDivider> 导航栏模式 </ElDivider>
    <TypePicker />

    <ElDivider> 界面功能 </ElDivider>

    <ElDivider> 界面显示 </ElDivider>

    <ElDivider> 动画 </ElDivider>
  </BasicDrawer>
</template>
