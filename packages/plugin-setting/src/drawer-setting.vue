<script setup lang="ts">
  import { ElDivider, ElColorPicker } from 'element-plus';
  import { BasicDrawer, useDrawerInner } from '@etfma/element-ui';
  import { reactive } from 'vue';
  import DarkMode from './components/dark-mode/index.vue';
  import { common } from '@etfma/core';

  const { changeTheme } = common.utils.createTheme();

  const [register] = useDrawerInner();

  const model = reactive({
    color: '#ffffff',
  });

  function handleColorChange(c: string | null) {
    changeTheme(c!);
  }
</script>

<template>
  <BasicDrawer @register="register" title="项目设置">
    <ElDivider> 主题 </ElDivider>
    <DarkMode />

    <ElColorPicker v-model="model.color" @change="handleColorChange" />

    <ElDivider> 导航栏模式 </ElDivider>

    <ElDivider> 界面功能 </ElDivider>

    <ElDivider> 界面显示 </ElDivider>

    <ElDivider> 动画 </ElDivider>
  </BasicDrawer>
</template>
