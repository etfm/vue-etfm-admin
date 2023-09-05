<script setup lang="ts">
  import { useNamespace } from '@etfm/hooks';
  import { Icon } from '@etfm/icon';
  import { ref } from 'vue';
  import { type PublicMultipleTab } from '../hooks/use-multiple-tab';
  import { useRouter } from 'vue-router';

  defineOptions({
    name: 'TabRedo',
  });

  const props = withDefaults(defineProps<{ store: PublicMultipleTab }>(), {});

  const { refresh } = props.store;

  const router = useRouter();
  const ns = useNamespace('tab-redo');

  const loading = ref(false);

  async function handleRedo() {
    loading.value = true;
    await refresh(router);
    loading.value = false;
  }
</script>
<template>
  <Icon
    :class="ns.b()"
    :spin="loading"
    :size="20"
    icon="material-symbols:restart-alt"
    @click="handleRedo"
  />
</template>
<style module lang="scss">
  @include b(tab-redo) {
    margin: 0 8px;
    cursor: pointer;
  }
</style>
