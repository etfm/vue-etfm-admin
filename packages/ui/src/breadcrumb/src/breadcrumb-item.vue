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
    name: 'EtfmBreadcrumbItem',
  });

  const props = defineProps(breadcrumbItemProps);

  const instance = getCurrentInstance()!;
  const breadcrumbContext = inject(breadcrumbKey, undefined)!;
  const ns = useNamespace('breadcrumb', { isCssModule: false });

  const { separator, separatorIcon } = toRefs(breadcrumbContext);
  const router = instance.appContext.config.globalProperties.$router as Router;

  const link = ref<HTMLSpanElement>();

  const onClick = () => {
    if (!props.to || !router) return;
    props.replace ? router.replace(props.to) : router.push(props.to);
  };
</script>
<style lang="scss" scope>
  @include b(breadcrumb) {
    @include e(separator) {
      margin: 0 9px;
      font-weight: bold;
      color: getCssVar('text-color', 'placeholder');

      &.icon {
        margin: 0 6px;
        font-weight: normal;

        svg {
          vertical-align: middle;
        }
      }
    }

    @include e(item) {
      display: inline-flex;
      align-items: center;
      float: left;

      @include e(inner) {
        color: getCssVar('text-color', 'regular');

        &.is-link,
        & a {
          font-weight: bold;
          color: getCssVar('text-color', 'primary');
          text-decoration: none;
          transition: getCssVar('transition', 'color');

          &:hover {
            color: getCssVar('color-primary');
            cursor: pointer;
          }
        }
      }

      &:last-child {
        .#{$namespace}-breadcrumb__inner,
        .#{$namespace}-breadcrumb__inner a {
          &,
          &:hover {
            font-weight: normal;
            color: getCssVar('text-color', 'regular');
            cursor: text;
          }
        }

        .#{$namespace}-breadcrumb__separator {
          display: none;
        }
      }
    }
  }
</style>
