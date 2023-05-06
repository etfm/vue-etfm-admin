<template>
  <div :class="[ns.b(), 'flex items-center']">{{}}</div>
</template>
<script setup lang="ts">
  import { useNamespace } from '@etfm/vea-hooks';

  const ns = useNamespace('basic-menu-item-content');

  defineOptions({
    name: 'BasicMenuItemContent',
  });

  interface Props {
    showTitle: boolean;
    level: number;
    isHorizontal: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showTitle: true,
    level: 0,
    isHorizontal: true,
  });
</script>
