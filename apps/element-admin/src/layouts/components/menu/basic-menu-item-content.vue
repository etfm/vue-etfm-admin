<template>
  <div :class="[ns.b(), 'flex items-center']">{{}}</div>
</template>
<script setup lang="ts">
  import type { IBasiMenuItemContent } from './type';
  import { useNamespace } from '@etfm/vea-hooks';

  const ns = useNamespace('basic-menu-item-content');

  defineOptions({
    name: 'BasicMenuItemContent',
  });

  const props = withDefaults(defineProps<IBasiMenuItemContent>(), {
    showTitle: true,
    level: 0,
    isHorizontal: true,
  });
</script>
