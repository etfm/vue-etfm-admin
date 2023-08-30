<script setup lang="ts">
  import { MenuRecordRaw } from '@etfma/types';
  import PageHeader from './page-header.vue';
  import PageContent from './page-content.vue';
  import { computed } from 'vue';

  interface Props {
    /**
     * 是否显示面包屑
     * @default true
     */
    showBreadcrumb?: boolean;
    /**
     * 面包屑分隔符
     * @default /
     */
    separator?: string;
    /**
     * 面包屑自定义数据，当数据为空则自动获取
     * @default []
     */
    breadcrumbList?: MenuRecordRaw[];
  }

  const props = withDefaults(defineProps<Props>(), {
    showBreadcrumb: true,
    separator: '/',
    breadcrumbList: () => [],
  });

  const showHeader = computed(() => {
    return props.showBreadcrumb;
  });
</script>

<template>
  <div>
    <PageHeader
      v-if="showHeader"
      :breadcrumb-list="breadcrumbList"
      :separator="separator"
      :show-breadcrumb="showBreadcrumb"
    ></PageHeader>
    <PageContent :show-header="showHeader">
      <template #default>
        <slot></slot>
      </template>
    </PageContent>
  </div>
</template>
