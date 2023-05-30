<template>
  <div @click="toggleCollapsed">
    <Icon :icon="icon" />
  </div>
</template>
<script setup lang="ts">
  import { Icon } from '@etfma/icons';
  import { computed } from 'vue';

  interface Props {
    /**
     * 是否折起
     */
    isCollapse: boolean;
  }

  const emit = defineEmits<{ (event: 'toggle', collapse: boolean): void }>();

  const props = withDefaults(defineProps<Props>(), {
    isCollapse: false,
  });

  const icon = computed(() => {
    return props.isCollapse
      ? 'tabler:layout-sidebar-right-collapse'
      : 'tabler:layout-sidebar-left-collapse';
  });

  const toggleCollapsed = () => {
    emit('toggle', props.isCollapse);
  };
</script>
