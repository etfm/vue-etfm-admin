<script setup lang="ts">
  import { MenuRecordRaw } from '@etfm/vea-types';
  import { useNamespace } from '@etfm/vea-hooks';

  const ns = useNamespace('basic-menu-item-content');

  defineOptions({
    name: 'BasicMenuItemContent',
  });

  interface Props {
    menu: MenuRecordRaw;
    showTitle: boolean;
    level: number;
    isHorizontal: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showTitle: true,
    level: 0,
    isHorizontal: true,
  });

  console.log(props);
</script>

<template>
  <div :class="[ns.b(), 'flex items-center']">{{ menu.name }}</div>
</template>

<style lang="scss" scoped module>
  @include b('basic-menu-item-content') {
  }
</style>
