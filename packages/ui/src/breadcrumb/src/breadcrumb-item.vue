<template>
  <span :class="ns.e('item')">
    <span ref="link" :class="[ns.e('inner'), ns.is('link', !!to)]" role="link" @click="onClick">
      <slot />
    </span>
    <etfma-icon v-if="separatorIcon" :class="ns.e('separator')">
      <component :is="separatorIcon" />
    </etfma-icon>
    <span v-else :class="ns.e('separator')" role="presentation">
      {{ separator }}
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, inject, ref, toRefs } from 'vue';
  import EtfmaIcon from '../../icon';
  import { useNamespace } from '@etfma/hooks';
  import { breadcrumbKey } from './constants';
  import { breadcrumbItemProps } from './breadcrumb-item';

  import type { Router } from '@etfma/types';

  defineOptions({
    name: 'ElBreadcrumbItem',
  });

  const props = defineProps(breadcrumbItemProps);

  const instance = getCurrentInstance()!;
  const breadcrumbContext = inject(breadcrumbKey, undefined)!;
  const ns = useNamespace('breadcrumb');

  const { separator, separatorIcon } = toRefs(breadcrumbContext);
  const router = instance.appContext.config.globalProperties.$router as Router;

  const link = ref<HTMLSpanElement>();

  const onClick = () => {
    if (!props.to || !router) return;
    props.replace ? router.replace(props.to) : router.push(props.to);
  };
</script>
