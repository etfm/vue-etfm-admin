<script setup lang="ts">
  import { MenuRecordRaw } from '@etfma/types';
  import { useNamespace } from 'element-plus';
  import { Icon } from '@etfma/icons';
  import { computed } from 'vue';

  const ns = useNamespace('basic-menu-item-content');

  defineOptions({
    name: 'BasicMenuItemContent',
  });

  interface Props {
    menu: MenuRecordRaw;
    showTitle?: boolean;
    showIcon?: boolean;
    level?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    showTitle: true,
    showIcon: true,
    level: 0,
    isHorizontal: true,
  });

  const icon = computed(() => props.menu.icon ?? '');
</script>

<template>
  <div :class="[ns.b(), 'flex items-center']">
    <Icon v-if="props.showIcon" :icon="icon"></Icon>
    <div v-if="props.showTitle" :class="['truncate']">{{ menu.name }}</div>
  </div>
</template>

<style lang="scss" scoped module></style>
