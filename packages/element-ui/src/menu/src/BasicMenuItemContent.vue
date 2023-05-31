<script setup lang="ts">
  import { MenuRecordRaw } from '@etfma/types';
  import { useNamespace, ElIcon } from 'element-plus';
  import { Icon } from '@etfma/icons';
  import { computed } from 'vue';

  const ns = useNamespace('basic-menu-item-content');

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
  }

  const props = withDefaults(defineProps<Props>(), {
    isHorizontal: true,
    showIcon: true,
  });

  const icon = computed(() => props.menu.icon ?? '');
</script>

<template>
  <ElIcon>
    <Icon v-if="props.showIcon" :icon="icon"></Icon>
  </ElIcon>

  <span>{{ menu.name }}</span>
</template>

<style lang="scss" scoped module></style>
