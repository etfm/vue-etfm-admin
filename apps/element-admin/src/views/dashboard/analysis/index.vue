<script setup lang="ts">
  import { ElInputNumber, ElCheckbox, ElRadioGroup, ElRadioButton } from 'element-plus';
  import { reactive } from 'vue';
  import { useNamespace } from '@etfm/hooks';
  import { PageContainer } from '@etfm/bs-ui';
  import { config } from 'etfm-engine';

  defineOptions({
    name: 'analysis',
    inheritAttrs: false,
  });

  const ns = useNamespace('analysis');

  const model = reactive({
    sideWidth: 180,
    siderCollapse: false,
    layout: 'side-nav',
    sideMixedExtraVisible: false,
    fixedMixedExtra: false,
    isMobile: false,
    uniqueOpened: false,
  });

  function handleSiderCollapse(c) {
    config.set('layout.sideCollapse', c);
  }

  function handleLayout(value) {
    config.set('layout', value);
  }

  function handleMixedExtraVisible(f) {
    config.set('layout.mixedExtraVisible', f);
  }
</script>

<template>
  <PageContainer>
    <div :class="[ns.b()]">
      <div class="p-5" :class="ns.e('body')">
        <div>左侧菜单宽度</div>
        <ElInputNumber v-model="model.sideWidth" />
        <ElCheckbox v-model="model.siderCollapse" class="mx-5" @change="handleSiderCollapse"
          >折叠菜单</ElCheckbox
        >
        <ElCheckbox
          v-model="model.sideMixedExtraVisible"
          @change="handleMixedExtraVisible"
          class="mx-5"
          >打开扩展菜单</ElCheckbox
        >
        <ElCheckbox v-model="model.fixedMixedExtra" class="mx-5">固定扩展菜单</ElCheckbox>
        <ElCheckbox v-model="model.isMobile" class="mx-5">isMobile</ElCheckbox>

        <hr />
        <div>切换布局</div>
        <ElRadioGroup v-model="model.layout" @change="handleLayout">
          <ElRadioButton label="side-nav"></ElRadioButton>
          <ElRadioButton label="header-nav"></ElRadioButton>
          <ElRadioButton label="mixed-nav"></ElRadioButton>
          <ElRadioButton label="side-mixed-nav"></ElRadioButton>
        </ElRadioGroup>
        <hr />
      </div>
    </div>
  </PageContainer>
</template>
<style scoped lang="scss" module>
  @include b('analysis') {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    background-color: getCssVar('fill-color');

    @include e('body') {
      background-color: getCssVar('bg-color');
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>
<style>
  .tooltip-base-box {
    width: 600px;
    margin-left: 300px;
  }
  .tooltip-base-box .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tooltip-base-box .center {
    justify-content: center;
  }
  .tooltip-base-box .box-item {
    width: 110px;
    margin-top: 10px;
  }

  .example-showcase .etfma-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
</style>
