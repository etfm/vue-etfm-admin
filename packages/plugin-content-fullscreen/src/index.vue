<script setup lang="ts">
  import { Icon } from '@etfm/icon';
  import { computed, ref, watchEffect } from 'vue';
  import { config } from 'etfm-engine';
  import { useNamespace } from '@etfm/hooks';

  defineOptions({
    name: 'ContentFullscreen',
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

  const ns = useNamespace('content-fullscreen');

  const hasFullscreen = ref(false);

  const getIcon = computed(() => {
    return hasFullscreen.value
      ? 'material-symbols:fit-screen'
      : 'material-symbols:fit-screen-outline';
  });

  watchEffect(() => {
    hasFullscreen.value = props.defaultFullscreen;

    if (props.defaultFullscreen) {
      enter();
    }
  });

  /**
   * @description 更新全屏状态
   */
  function handleFullscreen() {
    if (hasFullscreen.value) {
      hasFullscreen.value = false;
      exit();
    } else {
      hasFullscreen.value = true;
      enter();
    }
  }

  function enter() {
    config.set('layout.isFullContent', true);
  }

  function exit() {
    config.set('layout.isFullContent', false);
  }
</script>
<template>
  <div :class="ns.b()" @click="handleFullscreen">
    <Icon :icon="getIcon"></Icon>
  </div>
</template>
<style lang="scss" module>
  @include b(content-fullscreen) {
    display: flex;
    align-items: center;
    justify-items: center;
    height: 100%;
    padding: 0 8px;
    cursor: pointer;
  }
</style>
