<template>
  <div
    :class="[ns.b(), 'flex justify-center items-center rounded cursor-pointer']"
    @click="toggleCollapsed"
  >
    <Icon :icon="icon" color="#C0C4CC" />
  </div>
</template>
<script setup lang="ts">
  import { Icon } from '@etfma/icon';
  import { computed } from 'vue';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'LayoutTrigger',
  });

  interface Props {
    /**
     * 是否折起
     * @default false
     */
    isCollapse: boolean;
  }

  const emit = defineEmits<{ (event: 'toggle', collapse: boolean): void }>();

  const props = withDefaults(defineProps<Props>(), {
    isCollapse: false,
  });

  const ns = useNamespace('layout-trigger');

  const icon = computed(() => {
    return props.isCollapse
      ? 'tabler:layout-sidebar-right-collapse'
      : 'tabler:layout-sidebar-left-collapse';
  });

  const toggleCollapsed = () => {
    emit('toggle', props.isCollapse);
  };
</script>
<style scoped lang="scss" module>
  @include b('layout-trigger') {
    width: 24px;
    height: 24px;
    background-color: getCssVar('fill-color', 'lighter');

    &:hover {
      background-color: getCssVar('fill-color', 'dark');
    }
  }
</style>
