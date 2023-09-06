<script setup lang="ts">
  import { useNamespace } from '@etfm/hooks';
  import { ElTooltip } from 'element-plus';
  import { ref } from 'vue';
  import { config, skeleton } from 'etfm-engine';

  const ns = useNamespace('type-picker');
  const def = ref('aside');

  config.onGot('layout', (arg: string) => {
    def.value = arg;

    if (arg == 'top' || arg == 'mix') {
      skeleton.showWidget('PluginHeaderMenu');
    }
    if (arg == 'top') {
      skeleton.hideArea('aside');
    }

    if (arg == 'aside') {
      skeleton.showArea('aside');
      skeleton.hideWidget('PluginHeaderMenu');
    }
  });

  const menuTypeList = ref([
    {
      title: '左侧菜单模式',
      type: 'aside',
    },
    {
      title: '顶部菜单模式',
      type: 'top',
    },
    {
      title: '顶部菜单混合模式',
      type: 'mix',
    },
  ]);

  function handler(item) {
    def.value = item.type;
    config.set('layout', item.type);
  }
</script>

<template>
  <div :class="ns.b()">
    <template v-for="item in menuTypeList || []" :key="item.title">
      <ElTooltip :content="item.title" placement="bottom">
        <div
          @click="handler(item)"
          :class="[
            `${ns.e('item')}`,
            `${ns.em('item', item.type)}`,
            {
              [`${ns.em('item', 'active')}`]: def == item.type,
            },
          ]"
        >
        </div>
      </ElTooltip>
    </template>
  </div>
</template>

<style lang="scss" module>
  @include b(type-picker) {
    display: flex;
    justify-content: center;
    align-items: center;

    @include e(item) {
      position: relative;
      width: 56px;
      height: 48px;
      margin-right: 16px;
      overflow: hidden;
      border-radius: 4px;
      background-color: #f0f2f5;
      box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        position: absolute;
      }

      &--aside,
      &--light {
        &::before {
          z-index: 1;
          top: 0;
          left: 0;
          width: 33%;
          height: 100%;
          border-radius: 4px 0 0 4px;
          background-color: getCssVar('color-primary');
        }

        &::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #fff;
        }
      }

      &--mix {
        &::before {
          top: 0;
          left: 0;
          width: 33%;
          height: 100%;
          border-radius: 4px 0 0 4px;
          background-color: #fff;
        }

        &::after {
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: getCssVar('color-primary');
        }
      }

      &--top {
        &::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: getCssVar('color-primary');
        }
      }

      &--dark {
        background-color: getCssVar('color-primary');
      }

      &:hover,
      &--active {
        padding: 12px;
        border: 2px solid getCssVar('color-primary');
        box-sizing: border-box;

        &::before,
        &::after {
          border-radius: 0;
        }
      }
    }
  }
</style>
