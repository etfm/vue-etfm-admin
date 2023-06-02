<template>
  <div :class="[ns.b()]">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem v-for="item in breadcrumbList" :to="item.path">{{
        t(item.meta.title as string)
      }}</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
</template>
<script setup lang="ts">
  import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';
  import { useNamespace } from '@etfma/hooks';
  import { RouteLocationMatched, useRouter } from '@etfma/router';
  import { ref, unref, watchEffect } from 'vue';
  import { useI18n } from '@etfma/locale';

  const ns = useNamespace('layout-breadcrumd');

  const { currentRoute } = useRouter();
  const { t } = useI18n();

  const breadcrumbList = ref<RouteLocationMatched[]>([]);

  watchEffect(() => {
    const matched = unref(currentRoute).matched;

    breadcrumbList.value = matched.filter((item) => {
      const { meta, name } = item;
      if (!meta) {
        return !!name;
      }
      const { title, hideBreadcrumb } = meta;
      if (!title || hideBreadcrumb) {
        return false;
      }
      return true;
    });
  });
</script>
<style scoped lang="scss" module>
  @include b('layout-breadcrumd') {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: getCssVar('bg-color-page');
  }
</style>
