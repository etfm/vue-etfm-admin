<script setup lang="ts">
  import { ElSwitch, ElDivider } from 'element-plus';
  import { reactive } from 'vue';

  import { skeleton } from '@etfma/core';

  const modelArea = reactive({
    isLeft: true,
    isHeader: true,
    isRight: true,
    isBottom: true,
    isToolbar: true,
    isLeftFixed: true,
    isLeftFloat: false,
  });

  function handleArea(e, name) {
    if (e) {
      skeleton.showArea(name);
    } else {
      skeleton.hideArea(name);
    }
  }
</script>

<template>
  <div class="bg-white p-5 m-5">
    <ElDivider content-position="left">Area操作</ElDivider>
    <div>
      左侧菜单栏：
      <ElSwitch v-model="modelArea.isLeft" @change="(e) => handleArea(e, 'left')" />
    </div>
    <div>
      顶部显示栏：
      <ElSwitch v-model="modelArea.isHeader" @change="(e) => handleArea(e, 'top')" />
    </div>
    <div>
      右侧设置栏：
      <ElSwitch v-model="modelArea.isRight" @change="(e) => handleArea(e, 'right')" />
    </div>
    <div>
      底部显示栏：
      <ElSwitch v-model="modelArea.isBottom" @change="(e) => handleArea(e, 'bottom')" />
    </div>
    <div>
      Toolbar操作栏：
      <ElSwitch v-model="modelArea.isToolbar" @change="(e) => handleArea(e, 'toolbar')" />
    </div>
    <div>
      LeftFixedPane:
      <ElSwitch v-model="modelArea.isLeftFixed" @change="(e) => handleArea(e, 'leftFixedArea')" />
    </div>
    <div>
      LeftFloatPane:
      <ElSwitch v-model="modelArea.isLeftFloat" @change="(e) => handleArea(e, 'leftFloatArea')" />
    </div>
  </div>
</template>
