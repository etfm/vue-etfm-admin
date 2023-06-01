<script lang="ts" setup>
  import { useNamespace } from '@etfma/hooks';
  import AppLogo from '../components/logo/AppLogo.vue';
  import LayoutSetting from '../components/setting/layout-setting.vue';
  import { computed, reactive } from 'vue';

  defineOptions({
    name: 'Header',
  });

  interface SettingModel {
    /**
     * 是否显示设置栏
     * @default true
     */
    showSetting: boolean;
  }

  interface Props {
    /**
     * 布局方式
     * @default side-nav
     */
    layout: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    layout: 'side-nav',
  });

  const ns = useNamespace('header');

  const model = reactive<SettingModel>({
    showSetting: true,
  });

  const hasLogo = computed(() => props.layout !== 'side-nav');
</script>
<template>
  <div :class="ns.b()">
    <div v-if="hasLogo" :class="[ns.m('left')]">
      <AppLogo />
    </div>
    <div class="flex"> <LayoutSetting v-if="model.showSetting" /> {{ model.showSetting }} </div>
    <LayoutSetting v-if="model.showSetting" />
  </div>
</template>
<style scoped lang="scss" module>
  @include b('header') {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    @include m('left') {
      display: flex;
      align-items: center;
    }
  }
</style>
