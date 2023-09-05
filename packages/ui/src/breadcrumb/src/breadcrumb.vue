<template>
  <div ref="breadcrumb" :class="ns.b()" aria-label="Breadcrumb" role="navigation">
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, provide, ref } from 'vue';
  import { useNamespace } from '@etfm/hooks';
  import { breadcrumbKey } from './constants';
  import { breadcrumbProps } from './breadcrumb';

  defineOptions({
    name: 'EtfmBreadcrumb',
  });

  const props = defineProps(breadcrumbProps);

  const ns = useNamespace('breadcrumb', { isCssModule: false });
  const breadcrumb = ref<HTMLDivElement>();

  provide(breadcrumbKey, props);

  onMounted(() => {
    const items = breadcrumb.value!.querySelectorAll(`.${ns.e('item')}`);
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page');
    }
  });
</script>
<style lang="scss" scoped>
  @include b(breadcrumb) {
    font-size: 14px;
    line-height: 1;

    @include utils-clearfix;
  }
</style>
