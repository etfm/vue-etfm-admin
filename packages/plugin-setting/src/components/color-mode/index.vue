<script lang="ts" setup>
  import { useNamespace } from '@etfma/hooks';
  import { ref } from 'vue';
  import { ElColorPicker } from 'element-plus';
  import { common } from '@etfma/core';
  import { Icon } from '@etfma/icon';

  const { changeTheme } = common.utils.createTheme();

  defineOptions({
    name: 'setting-color',
  });

  const ns = useNamespace('setting-color');
  const def = ref('#409eff');

  const colors = ref([
    '#409eff',
    '#f5222d',
    '#fa541c',
    '#fadb14',
    '#13c2c2',
    '#52c41a',
    '#eb2f96',
    '#722ed1',
  ]);

  const cssMap = {
    '#409eff': ns.cssVar({
      'menu-bg-color': '#001529',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#f5222d': ns.cssVar({
      'menu-bg-color': '#2a0608',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#fa541c': ns.cssVar({
      'menu-bg-color': '#2b0e05',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#fadb14': ns.cssVar({
      'menu-bg-color': '#2b2503',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#13c2c2': ns.cssVar({
      'menu-bg-color': '#032121',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#52c41a': ns.cssVar({
      'menu-bg-color': '#0b1e15',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#eb2f96': ns.cssVar({
      'menu-bg-color': '#28081a',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#722ed1': ns.cssVar({
      'menu-bg-color': '#130824',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
  };

  function handleColorChange(color: string | null) {
    def.value = color!;

    changeTheme(color!, { overrides: cssMap[color!] });
  }

  // --etfm-menu-bg-color: #001529 (背景颜色)
  // --etfm-menu-bg-sub-menu-item-color： #0f0303（子菜单颜色）
  // --etfm-menu-text-color: rgba(254,254,254,0.65) (菜单文字)
</script>

<template>
  <div :class="ns.em('content', 'inline')">
    <div :class="ns.b()">
      <template v-for="color in colors" :key="color">
        <span
          @click="handleColorChange(color)"
          :class="[
            ns.e('item'),
            {
              [ns.em('item', 'active')]: def === color,
            },
          ]"
          :style="{ background: color }"
        >
          <Icon icon="material-symbols:check-small" color="white" />
        </span>
      </template>
    </div>
    <ElColorPicker v-model="def" @change="handleColorChange"> </ElColorPicker>
  </div>
</template>
<style lang="scss" module>
  @include b(setting-color) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 16px 0;
    flex: 1;

    @include e(content) {
      @include m(inline) {
        display: flex;
        align-items: center;
      }
    }

    @include e(item) {
      width: 20px;
      height: 20px;
      border: 1px solid #ddd;
      border-radius: 2px;
      cursor: pointer;

      svg {
        display: none;
      }

      @include m(active) {
        svg {
          display: inline-block;
          margin: 0 0 3px 1px;
          font-size: 18px;
        }
      }
    }
  }
</style>
