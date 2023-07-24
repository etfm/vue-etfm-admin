<script lang="ts" setup>
  import { BasicTitle } from '../../../basic';
  import { Icon } from '@etfma/icon';
  import { useNamespace } from '@etfma/hooks';
  import { headerProps } from '../props';

  const emit = defineEmits<{
    close: [];
  }>();

  defineProps(headerProps);

  const ns = useNamespace('basic-drawer-header');

  function handleClose() {
    emit('close');
  }
</script>

<template>
  <BasicTitle v-if="!isDetail" :class="ns.b()">
    <slot name="title"></slot>
    {{ !$slots.title ? title : '' }}
  </BasicTitle>

  <div :class="[ns.b()]" v-else>
    <span :class="ns.e('wrap')">
      <span @click="handleClose" v-if="showDetailBack">
        <Icon :class="ns.m('back')" icon="material-symbols:arrow-back-ios" />
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span :class="ns.e('toolbar')">
      <slot name="titleToolbar"></slot>
    </span>
  </div>
</template>

<style lang="scss" module>
  @include b(basic-drawer-header) {
    display: flex;
    align-items: center;
    height: 100%;

    @include e(wrap) {
      flex: 1;

      @include m(back) {
        padding: 0 12px;
        cursor: pointer;

        &:hover {
          color: getCssVar('fill-color');
        }
      }
    }

    @include e(toolbar) {
      padding-right: 50px;
    }
  }
</style>
