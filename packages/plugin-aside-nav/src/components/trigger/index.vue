<script setup lang="ts">
  import { Icon } from '@etfm/icon';
  import { computed } from 'vue';
  import { useNamespace } from '@etfm/hooks';

  defineOptions({
    name: 'LayoutTrigger',
  });

  interface Props {
    /**
     * 是否折起
     * @default false
     */
    collapse: boolean;
  }

  const emit = defineEmits<{ (event: 'toggle', collapse: boolean): void }>();

  const props = withDefaults(defineProps<Props>(), {
    collapse: false,
  });

  const ns = useNamespace('layout-trigger');

  const icon = computed(() => {
    return props.collapse
      ? 'tabler:layout-sidebar-right-collapse'
      : 'tabler:layout-sidebar-left-collapse';
  });

  const toggleCollapsed = () => {
    emit('toggle', props.collapse);
  };
</script>
<template>
  <div :class="[ns.b()]" @click="toggleCollapsed">
    <Icon :icon="icon" color="#C0C4CC" />
  </div>
</template>
<style module lang="scss">
  @include b('layout-trigger') {
    width: 24px;
    height: 24px;
    background-color: getCssVar('fill-color');
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background-color: getCssVar('fill-color', 'dark');
    }
  }
</style>
