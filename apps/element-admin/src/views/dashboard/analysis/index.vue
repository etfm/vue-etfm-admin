<script setup lang="ts">
  import { ElSwitch, ElDivider } from 'element-plus';
  import { reactive } from 'vue';
  import { skeleton } from '@etfma/core';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'analysis',
    inheritAttrs: false,
  });

  const ns = useNamespace('analysis');

  const modelArea = reactive({
    isLeft: true,
    isHeader: true,
    isRight: true,
    isBottom: true,
    isToolbar: true,
    isLeftFixed: true,
    isLeftFloat: false,
  });

  const modelWidget = reactive({
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

  function handleWidget(e, name) {
    if (e) {
      skeleton.showWidget(name);
    } else {
      skeleton.hideWidget(name);
    }
  }

  skeleton.onHideWidget((name) => {
    console.log('监听隐藏widget事件', name);
  });

  skeleton.onShowWidget((name) => {
    console.log('监听显示widget事件', name);
  });

  skeleton.onHideArea((name) => {
    console.log('监听隐藏Area事件', name);
  });

  skeleton.onShowArea((name) => {
    console.log('监听显示Area事件', name);
  });
</script>

<template>
  <div class="bg-white p-5 m-5" :class="[ns.b()]">
    <ElDivider content-position="left">Area操作</ElDivider>
    <div>
      左侧菜单栏：
      <ElSwitch v-model="modelArea.isLeft" @change="(e) => handleArea(e, 'aside')" />
    </div>
    <div>
      顶部显示栏：
      <ElSwitch v-model="modelArea.isHeader" @change="(e) => handleArea(e, 'header')" />
    </div>
    <div>
      底部显示栏：
      <ElSwitch v-model="modelArea.isBottom" @change="(e) => handleArea(e, 'footer')" />
    </div>
    <div>
      Toolbar操作栏：
      <ElSwitch v-model="modelArea.isToolbar" @change="(e) => handleArea(e, 'toolbar')" />
    </div>
    <div>
      Breadcrumb操作栏：
      <ElSwitch v-model="modelArea.isToolbar" @change="(e) => handleArea(e, 'breadcrumb')" />
    </div>
    <div>
      Fixed:
      <ElSwitch v-model="modelArea.isLeftFixed" @change="(e) => handleArea(e, 'fixed')" />
    </div>
    <div>
      Float:
      <ElSwitch v-model="modelArea.isLeftFloat" @change="(e) => handleArea(e, 'float')" />
    </div>
    <ElDivider content-position="left">Widget操作</ElDivider>
    widget显示隐藏：
    <ElSwitch v-model="modelWidget.isLeft" @change="(e) => handleWidget(e, 'leftArea')" />
  </div>
</template>
<style scoped lang="scss">
  @include b('analysis') {
    display: block;
    flex-direction: column;
    align-items: center;
  }
</style>
