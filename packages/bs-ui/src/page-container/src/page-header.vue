<script setup lang="ts">
  import { useNamespace } from '@etfm/hooks';
  import HeaderBreadcrumb from './breadcrumb.vue';
  import { MenuRecordRaw } from '@etfm/types';

  interface Props {
    showBreadcrumb?: boolean;
    separator?: string;
    breadcrumbList?: MenuRecordRaw[];
  }

  withDefaults(defineProps<Props>(), {});

  const { b } = useNamespace('page-header');
</script>

<template>
  <header :class="b()">
    <HeaderBreadcrumb
      v-if="showBreadcrumb"
      :separator="separator"
      :breadcrumb-list="breadcrumbList"
    />
  </header>
</template>
<style lang="scss" module>
  @include b(page-header) {
    padding-block: 20px;
    padding-inline: 20px;
  }
</style>
