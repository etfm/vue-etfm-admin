<script lang="ts" setup>
  import { EtfmAdminLayout } from '@etfma/layout';
  import { reactive } from 'vue';
  import LayoutContent from './content/layout-content.vue';
  import LayoutSider from './sider/layout-sider.vue';
  import LayoutHeader from './header/layout-header.vue';

  import { ElInputNumber, ElCheckbox, ElRadioGroup, ElRadioButton } from 'element-plus';

  defineOptions({
    name: 'Layout',
  });

  const model = reactive({
    sideWidth: 180,
    siderCollapse: false,
    layout: 'side-nav',
    sideMixedExtraVisible: false,
    fixedMixedExtra: false,
    isMobile: false,
  });

  /**
   * 折叠菜单
   * @param collapse
   */
  const toggleCollapsed = (collapse: boolean) => {
    model.siderCollapse = !collapse;
  };
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
      <LayoutSider
        :is-collapse="model.siderCollapse"
        :layout="model.layout"
        @toggle="toggleCollapsed"
      />
    </template>
    <template #side-extra>side-extra</template>
    <template #header>
      <LayoutHeader :layout="model.layout" />
      <!-- <LayoutMenu
        v-if="model.layout === 'mixed-nav' || model.layout === 'header-nav'"
        isHorizontal
      /> -->
    </template>
    <template #footer>footer</template>
    <template #content>
      <LayoutContent />
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
