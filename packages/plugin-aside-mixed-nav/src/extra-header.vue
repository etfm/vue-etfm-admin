<script setup lang="ts">
  import { useNamespace } from '@etfm/hooks';
  import { CSSProperties, computed, onUnmounted, reactive } from 'vue';
  import { config, event } from 'etfm-engine';
  import { Icon } from '@etfm/icon';

  defineOptions({
    name: 'side-mixed-nav-extra-header',
    inheritAttrs: false,
  });

  interface Props {
    title?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
  });

  const { b, e } = useNamespace('side-mixed-nav-extra-header');

  const model = reactive({
    title: props.title,
    height: 0,
    fixed: false,
  });

  const style = computed<CSSProperties>(() => {
    return {
      height: `${model.height}px`,
      width: '100%',
    };
  });

  config.onGot('layout.headerHeight', (e: number) => {
    model.height = e;
  });

  config.onGot('layout.fixedMixedExtra', (e: boolean) => {
    model.fixed = e;
  });

  const disposeTitle = event.on('side-mixed-nav:title', (e: string) => {
    model.title = e;
  });

  onUnmounted(() => {
    disposeTitle();
  });

  /**
   * 修改固定方式
   */
  function handleFixed() {
    config.set('layout.fixedMixedExtra', !model.fixed);
  }
</script>

<template>
  <div :class="b()" :style="style">
    <div :class="e('title')">{{ model.title }}</div>
    <Icon
      :class="e('icon')"
      :icon="model.fixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'"
      @click="handleFixed"
    />
  </div>
</template>
<style lang="scss" module>
  @include b(side-mixed-nav-extra-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid getCssVar('border-color');
    box-sizing: border-box;

    @include e(title) {
      font-size: 18px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
