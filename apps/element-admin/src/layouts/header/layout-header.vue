<template>
  <ElHeader :class="ns.b()">
    <div :class="[ns.m('left')]">
      <AppLogo />
      <!-- 收缩组件 -->
      <HeaderTrigger />
      <!-- 面包屑 -->
      <LayoutBreadcrumb />
    </div>
    <div :class="[ns.m('right')]">
      <LayoutSetting />
    </div>
  </ElHeader>
</template>
<script lang="ts" setup>
  import { ElHeader } from 'element-plus';
  import HeaderTrigger from '../trigger/header-trigger.vue';
  import LayoutBreadcrumb from '../components/breadcrumb/layout-breadcrumb.vue';
  import { useNamespace } from '@etfma/hooks';
  import AppLogo from '../components/logo/AppLogo.vue';
  import LayoutSetting from '../components/setting/layout-setting.vue';

  const ns = useNamespace('header');
</script>
<style scoped lang="scss" module>
  @include b('header') {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px;

    @include m(left) {
      display: flex;
      align-items: center;
    }
  }
</style>
