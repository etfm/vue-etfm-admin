<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import Moon from '../../icon/moon.vue';
  import Sun from '../../icon/sun.vue';
  import { EtfmaIcon } from '@etfma/ui';
  import { computed, ref, unref } from 'vue';
  import { theme } from '@etfma/core';

  defineOptions({
    name: 'DarkMode',
  });

  const ns = useNamespace('dark-mode');
  // const { changeTheme } = useTheme();

  // const cssMap = {
  //   '#409eff': ns.cssVar({
  //     // 'aside-area-bg-color': '#001529',
  //     // 'header-area-bg-color': '#001529',
  //     // 'menu-bg-sub-menu-item-color': '#0f0303',
  //     // 'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#f5222d': ns.cssVar({
  //     'aside-area-bg-color': '#2a0608',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#fa541c': ns.cssVar({
  //     'aside-area-bg-color': '#2b0e05',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#fadb14': ns.cssVar({
  //     'aside-area-bg-color': '#2b2503',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#13c2c2': ns.cssVar({
  //     'aside-area-bg-color': '#032121',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#52c41a': ns.cssVar({
  //     'aside-area-bg-color': '#0b1e15',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#eb2f96': ns.cssVar({
  //     'aside-area-bg-color': '#28081a',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  //   '#722ed1': ns.cssVar({
  //     'aside-area-bg-color': '#130824',
  //     'menu-bg-sub-menu-item-color': '#0f0303',
  //     'menu-text-color': 'rgba(254,254,254,0.65)',
  //   }),
  // };

  const isDarkRef = ref(theme.isDark);

  const getClass = computed(() => [
    ns.b('switch'),
    {
      [`${ns.bm('switch', 'dark')}`]: unref(isDarkRef),
    },
  ]);

  theme.onChange((flag) => {
    isDarkRef.value = flag;
  });

  function toggleDarkMode() {
    theme.toggle();
  }
</script>
<template>
  <div :class="ns.b()">
    <div :class="getClass" @click="toggleDarkMode">
      <div :class="ns.b('switch-inner')"></div>
      <EtfmaIcon size="16" color="#ffd04b">
        <Sun />
      </EtfmaIcon>
      <EtfmaIcon size="16" color="#ffd04b">
        <Moon />
      </EtfmaIcon>
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b('dark-mode') {
    display: flex;
    align-items: center;
    justify-content: center;

    @include b('dark-mode-switch') {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
      width: 40px;
      height: 26px;
      padding: 0 6px;
      border-radius: 30px;
      background-color: #151515;
      cursor: pointer;

      @include b('dark-mode-switch-inner') {
        position: absolute;
        z-index: 1;
        width: 18px;
        height: 18px;
        transition: transform 0.5s, background-color 0.5s;
        border-radius: 50%;
        background-color: #fff;
        will-change: transform;
      }

      @include m(dark) {
        @include b('dark-mode-switch-inner') {
          transform: translateX(calc(100% + 2px));
        }
      }
    }
  }
</style>
