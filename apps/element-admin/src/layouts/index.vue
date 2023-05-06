<script lang="ts" setup>
  import { EtfmAdminLayout } from '@etfm/layout';
  import { ElCheckbox, ElInputNumber, ElRadioGroup, ElRadioButton } from 'element-plus';
  import { reactive } from 'vue';
  import AppLogo from './components/logo/AppLogo.vue';
  import LayoutMenu from './menu/index.vue';

  defineOptions({
    name: 'Dashboard',
  });

  const model = reactive({
    sideWidth: 200,
    siderCollapse: false,
    layout: 'side-nav',
    sideMixedExtraVisible: false,
    fixedMixedExtra: false,
    isMobile: false,
  });
</script>

<template>
  <EtfmAdminLayout
    :sideWidth="model.sideWidth"
    :layout="model.layout"
    :fixedMixedExtra="model.fixedMixedExtra"
    :isMobile="model.isMobile"
    v-model:side-collapse="model.siderCollapse"
    v-model:mixed-extra-visible="model.sideMixedExtraVisible"
  >
    <template #side>
      <div>
        <AppLogo />
        <LayoutMenu />
      </div>
    </template>
    <template #side-extra>side-extra</template>
    <template #header>header</template>
    <template #footer>footer</template>
    <template #content>
      <div>
        <div>左侧菜单宽度</div>
        <ElInputNumber v-model="model.sideWidth" />
        <ElCheckbox v-model="model.siderCollapse" class="mx-5">折叠菜单</ElCheckbox>

        <ElCheckbox v-model="model.sideMixedExtraVisible" class="mx-5">打开扩展菜单</ElCheckbox>
        <ElCheckbox v-model="model.fixedMixedExtra" class="mx-5">固定扩展菜单</ElCheckbox>
        <ElCheckbox v-model="model.isMobile" class="mx-5">isMobile</ElCheckbox>
        <hr />
        <div>切换布局</div>
        <ElRadioGroup v-model="model.layout">
          <ElRadioButton label="side-nav">side-nav</ElRadioButton>
          <ElRadioButton label="header-nav">header-nav</ElRadioButton>
          <ElRadioButton label="mixed-nav">mixed-nav</ElRadioButton>
          <ElRadioButton label="side-mixed-nav">side-mixed-nav</ElRadioButton>
          <ElRadioButton label="full-content">full-content</ElRadioButton>
        </ElRadioGroup>
        <hr />
      </div>
    </template>
  </EtfmAdminLayout>
</template>
