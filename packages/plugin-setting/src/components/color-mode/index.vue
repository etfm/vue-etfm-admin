<script lang="ts" setup>
  import { useNamespace } from '@etfm/hooks';
  import { ref } from 'vue';
  import { Icon } from '@etfm/icon';
  import { config } from 'etfm-engine';
  import { SwitchItem } from '../switch-item';

  defineOptions({
    name: 'setting-color',
  });

  const ns = useNamespace('setting-color');

  const def = ref('#0960bd');
  const colors = ref([
    '#0960bd',
    '#722ed1',
    '#13c2c2',
    '#fa541c',
    '#f5222d',
    '#eb2f96',
    '#fadb14',
    '#52c41a',
  ]);

  const themeColor = ref(true);

  /**
   * 更改主题颜色
   * @param color
   */
  function handleColorChange(color: string | null) {
    def.value = color!;

    config.set('theme.color', color!);
  }

  /**
   * 更改系统主题
   * @param e
   */
  function handleChange(e: any) {
    if (e) {
      config.set('theme', 'light');
    } else {
      config.set('theme', 'dark');
    }
  }
</script>

<template>
  <div :class="ns.b()">
    <SwitchItem
      v-model="themeColor"
      title="主题类型"
      active-text="亮色"
      inactive-text="深色"
      inactive-color="#000000"
      @change="handleChange"
    ></SwitchItem>
    <div :class="ns.e('content')">
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
  </div>
</template>
<style lang="scss" module>
  @include b(setting-color) {
    @include e(content) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 16px 0;
      flex: 1;
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
