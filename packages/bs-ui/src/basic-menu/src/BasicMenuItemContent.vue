<script setup lang="ts">
  import { MenuRecordRaw } from '@etfma/types';
  import { Icon } from '@etfma/icon';
  import { computed } from 'vue';
  import { EtfmaIcon } from '@etfma/ui';

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
    showIcon: true,
    showTitle: true,
  });

  const isShowIcon = computed(() => props.menu.icon && props.showIcon);
</script>

<template>
  <EtfmaIcon>
    <Icon v-if="isShowIcon" :icon="menu.icon!"></Icon>
  </EtfmaIcon>

  <span v-if="showTitle">{{ menu.name }}</span>
</template>

<style lang="scss" scoped></style>
