<script lang="ts" setup>
  import { useSlots, computed } from 'vue';
  import BasicHelp from './basic-help.vue';
  import { useNamespace } from '@etfma/hooks';
  import { basicTitleProps } from './props';

  const props = defineProps(basicTitleProps);

  const ns = useNamespace('basic-title');
  const slots = useSlots();
  const getClass = computed(() => [
    ns.b(),
    { [ns.b('show-span')]: props.span && slots.default },
    { [ns.b('normal')]: props.normal },
  ]);
</script>
<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="ns.b()" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>
<style lang="scss" module>
  @include b(basic-title) {
    display: flex;
    position: relative;
    padding-left: 7px;
    color: getCssVar('text', 'color-primary');
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    user-select: none;

    &-normal {
      font-size: 14px;
      font-weight: 500;
    }

    &-show-span::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background-color: getCssVar('color-primary');
    }
  }
</style>
