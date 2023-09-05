<script setup lang="ts">
  import { useFullscreen, useNamespace } from '@etfm/hooks';
  import { computed, watchEffect } from 'vue';
  import { Icon } from '@etfm/icon';

  defineOptions({
    name: 'PluginFullscreen',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * @description 是否全屏
     * @default false
     */
    defaultFullscreen?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultFullscreen: false,
  });

  const ns = useNamespace('fullscreen');
  const { isFullscreen, enter, toggle } = useFullscreen();

  const getIcon = computed(() => {
    return isFullscreen.value ? 'material-symbols:fullscreen-exit' : 'material-symbols:fullscreen';
  });

  watchEffect(() => {
    if (props.defaultFullscreen) {
      enter();
    }
  });
</script>

<template>
  <div :class="ns.b()" @click="toggle">
    <Icon :icon="getIcon" :size="22"></Icon>
  </div>
</template>
<style lang="scss" module>
  @include b(fullscreen) {
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: 100%;
    padding: 0 16px;
    cursor: pointer;
  }
</style>
