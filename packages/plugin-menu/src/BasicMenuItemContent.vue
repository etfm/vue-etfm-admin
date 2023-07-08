<script setup lang="ts">
  import { MenuRecordRaw } from '@etfma/types';
  import { Icon } from '@etfma/icons';
  import { computed } from 'vue';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'BasicMenuItemContent',
  });

  interface Props {
    /**
     * 菜单
     * @default []
     */
    menu: MenuRecordRaw;
    /**
     * 是否显示图标
     * @default true
     */
    showIcon?: boolean;
    /**
     * 是否显示标题
     * @default true
     */
    showTitle?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isHorizontal: true,
    showIcon: true,
    showTitle: true,
  });

  const ns = useNamespace('basic-menu-item-content');

  const icon = computed(() => props.menu.icon ?? '');
</script>

<template>
  <Icon v-if="props.showIcon" :icon="icon"></Icon>

  <span v-if="showTitle">{{ menu.name }}</span>
</template>

<style lang="scss" scoped></style>
