<script lang="ts" setup>
  import { ElColorPicker } from 'element-plus';
  import { common } from '@etfma/core';
  import { reactive } from 'vue';

  const { changeTheme } = common.utils.createTheme();

  const model = reactive({
    color: '#ffffff',
  });

  function handleColorChange(c: string | null) {
    changeTheme(c!);
  }
</script>

<template>
  <ElColorPicker v-model="model.color" @change="handleColorChange"> </ElColorPicker>
</template>
<style lang="scss" module></style>
