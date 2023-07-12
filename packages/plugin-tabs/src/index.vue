<script setup lang="ts">
  import { ref, unref, watch } from 'vue';

  import { RouteLocationNormalized, RouteMeta, useRouter } from 'vue-router';
  import { useMultipleTab } from './use-multiple-tab';
  import { EtfmaTag } from '@etfma/etfma-ui';

  defineOptions({
    name: 'Tabs',
    inheritAttrs: false,
  });

  const { currentRoute, getRoutes } = useRouter();
  const { addTab, getTabList } = useMultipleTab();

  const activeKeyRef = ref('');

  watch(
    currentRoute,
    (route) => {
      const { path, fullPath, meta = {} } = route;
      const { currentActiveMenu, hideTab } = meta as RouteMeta;
      const isHide = !hideTab ? null : currentActiveMenu;
      const p = isHide || fullPath || path;
      if (activeKeyRef.value !== p) {
        activeKeyRef.value = p as string;
      }

      if (isHide) {
        const findParentRoute = getRoutes().find((item) => item.path === currentActiveMenu);

        findParentRoute && addTab(findParentRoute as unknown as RouteLocationNormalized);
      } else {
        addTab(unref(route));
      }

      console.log(getTabList.value);
    },
    { immediate: true },
  );
</script>

<template>
  <div>
    <EtfmaTag v-for="(tag, index) in getTabList"> </EtfmaTag>
  </div>
</template>
