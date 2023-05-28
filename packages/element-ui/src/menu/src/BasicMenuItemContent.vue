<script setup lang="ts">
  import { MenuRecordRaw } from '@etfma/types';
  import { useNamespace } from 'element-plus';

  const ns = useNamespace('basic-menu-item-content');

  defineOptions({
    name: 'BasicMenuItemContent',
  });

  interface Props {
    menu: MenuRecordRaw;
    showTitle?: boolean;
    level?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    showTitle: true,
    level: 0,
    isHorizontal: true,
  });
</script>

<template>
  <div :class="[ns.b(), 'truncate']">{{ menu.name }}</div>
</template>

<style lang="scss" scoped module></style>
