<script setup lang="ts">
  import Layout from './layout.vue';
  import { reactive } from 'vue';
  import type { IPublicLayout, ISkeleton } from '@etfm/types';
  import { useGotLayoutConfig } from '../hooks';

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    skeleton: ISkeleton;
  }

  withDefaults(defineProps<Props>(), {});

  const model = reactive<IPublicLayout>({});

  useGotLayoutConfig(model);
</script>

<template>
  <Layout
    v-bind="model"
    v-model:mixed-extra-visible="model.mixedExtraVisible"
    v-model:side-collapse="model.sideCollapse"
    :skeleton="skeleton"
  >
  </Layout>
</template>
