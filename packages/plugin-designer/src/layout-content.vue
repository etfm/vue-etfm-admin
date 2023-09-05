<script setup lang="ts">
  import { ref } from 'vue';
  import { getTransitionName } from './transition';
  import { RouterView } from 'etfm-engine';

  defineOptions({
    name: 'LayoutContent',
    inheritAttrs: false,
  });

  const openCache = ref(true);
  const hasCache = ref(false);
  const enableTransition = ref(true);
  const defaultTransitionName = ref('');
  const cacheTabs = ref([]);
</script>

<template>
  <RouterView>
    <template #default="{ Component, route }">
      <Transition
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition,
            cacheTabs,
            defaultTransitionName,
          })
        "
        mode="out-in"
        appear
      >
        <KeepAlive v-if="hasCache">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
        <component v-else :is="Component" :key="route.fullPath" />
      </Transition>
    </template>
  </RouterView>
</template>
