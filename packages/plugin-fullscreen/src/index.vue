<script setup lang="ts">
  import {} from '@etfma/shared';
  import { useFullscreen, useNamespace } from '@etfma/hooks';
  import { computed, watchEffect } from 'vue';
  import { Icon } from '@etfma/icon';

  defineOptions({
    name: 'PluginBreadcrumbFullscreen',
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

  const ns = useNamespace('pf');
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
<style lang="scss" scoped>
  @include b(pf) {
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: 100%;
    padding: 0 16px;
    cursor: pointer;
  }
</style>
