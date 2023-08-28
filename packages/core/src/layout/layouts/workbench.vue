<script setup lang="ts">
  import { Skeleton } from '../skeleton';
  import Layout from './layout.vue';
  import { engineConfig } from '../../config';
  import { ref } from 'vue';
  import { deepMerge } from '@etfma/shared';
  import type { IPublicLayout } from '@etfma/types';

  interface Props {
    skeleton: Skeleton;
  }

  withDefaults(defineProps<Props>(), {});

  const model = ref<IPublicLayout>({});

  engineConfig.onGot('layout', (layout) => {
    console.log(layout, '============');
    model.value = deepMerge(model.value, layout);
  });
</script>

<template>
  <Layout v-bind="model" :skeleton="skeleton"> </Layout>
</template>
