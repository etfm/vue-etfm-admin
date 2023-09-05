<script lang="ts" setup>
  import { useNamespace } from '@etfm/hooks';
  import { computed, ref } from 'vue';
  import { ElColorPicker } from 'element-plus';
  import { Icon } from '@etfm/icon';

  defineOptions({
    name: 'setting-color',
  });

  interface Props {
    theme: 'light' | 'dark';
  }

  const props = withDefaults(defineProps<Props>(), {
    theme: 'light',
  });

  const emit = defineEmits<{
    change: [color: string];
  }>();

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

  const hasColorPicker = computed(() => props.theme === 'light');

  function handleColorChange(color: string | null) {
    def.value = color!;

    emit('change', color!);
  }
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
    <ElColorPicker v-if="hasColorPicker" v-model="def" @change="handleColorChange"> </ElColorPicker>
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
