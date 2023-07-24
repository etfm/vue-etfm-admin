<script lang="ts" setup>
  import { useNamespace } from '@etfma/hooks';
  import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
  import { useTabsProviderContext } from '../constants';

  defineOptions({
    name: 'TabPane',
  });

  const instance = getCurrentInstance()!;

  interface Props {
    /**
     * key
     * @default ''
     */
    name: string;
    /**
     * title
     * @default ''
     */
    title: string;
  }

  const props = withDefaults(defineProps<Props>(), { name: '', title: '' });

  const ns = useNamespace('tab-pane');

  const inject = useTabsProviderContext();

  onMounted(() => {
    inject.registerPane(instance);
  });

  onUnmounted(() => {
    inject.unregisterPane(props.name);
  });

  function handleClick() {
    inject.tabClick(props.name);
  }

  defineExpose({
    name: props.name,
    title: props.title,
  });
</script>

<template>
  <div :class="[ns.b('tag')]" :key="name" @click="handleClick">
    <slot />
  </div>
</template>
<style module lang="scss">
  @include b(tab-pane-tag) {
    margin: 4px 3px;
    cursor: pointer;
  }
</style>
