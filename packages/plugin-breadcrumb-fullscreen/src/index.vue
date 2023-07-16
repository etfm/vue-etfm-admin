<script setup lang="ts">
  import { Icon } from '@etfma/icon';
  import { computed, ref, watchEffect } from 'vue';
  import { skeleton } from '@etfma/core';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'PluginBreadcrumbFullscreen',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * @description 是否全屏
     * @default false
     */
    isFullscreen?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isFullscreen: false,
  });

  const emit = defineEmits<{
    'update:isFullscreen': [e: boolean];
  }>();

  const ns = useNamespace('pbf');

  const hasFullscreen = ref(false);

  const getIcon = computed(() => {
    return hasFullscreen.value
      ? 'material-symbols:fit-screen'
      : 'material-symbols:fit-screen-outline';
  });

  watchEffect(() => {
    hasFullscreen.value = props.isFullscreen;
  });

  /**
   * @description 更新全屏状态
   */
  function handleFullscreen() {
    if (hasFullscreen.value) {
      hasFullscreen.value = false;
      skeleton.showArea('header');
      skeleton.showArea('aside');
    } else {
      hasFullscreen.value = true;
      skeleton.hideArea('header');
      skeleton.hideArea('aside');
    }

    emit('update:isFullscreen', hasFullscreen.value);
  }
</script>
<template>
  <div :class="ns.b()" @click="handleFullscreen">
    <Icon :icon="getIcon"></Icon>
  </div>
</template>
<style lang="scss" scoped>
  @include b(pbf) {
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: 100%;
    padding: 0 8px;
    cursor: pointer;
  }
</style>
