<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import Moon from '../../icon/moon.vue';
  import Sun from '../../icon/sun.vue';
  import { EtfmaIcon } from '@etfma/ui';
  import { computed, unref } from 'vue';
  import { useDark, useToggle } from '@vueuse/core';

  defineOptions({
    name: 'DarkMode',
  });

  const ns = useNamespace('dark-mode');
  const isDark = useDark();
  const toggle = useToggle(isDark);

  const getClass = computed(() => [
    ns.b('switch'),
    {
      [`${ns.bm('switch', 'dark')}`]: unref(isDark),
    },
  ]);

  function toggleDarkMode() {
    toggle();
    console.log(isDark.value);
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
