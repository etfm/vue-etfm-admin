<script lang="ts" setup>
  import { useNamespace } from '@etfma/hooks';
  import { footerProps } from '../props';
  import { ElButton } from 'element-plus';

  defineOptions({
    name: 'BasicDrawerFooter',
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    ok: [];
    close: [];
  }>();

  defineProps(footerProps);

  const ns = useNamespace('basic-drawer-footer');

  function handleOk() {
    emit('ok');
  }

  function handleClose() {
    emit('close');
  }
</script>

<template>
  <div :class="ns.b()" v-if="showFooter || $slots.footer">
    <template v-if="!$slots.footer">
      <slot name="insertFooter"></slot>
      <ElButton v-bind="cancelButtonProps" @click="handleClose" class="mr-2" v-if="showCancelBtn">
        {{ cancelText }}
      </ElButton>
      <slot name="centerFooter"></slot>
      <ElButton
        :type="okType"
        @click="handleOk"
        v-bind="okButtonProps"
        class="mr-2"
        :loading="confirmLoading"
        v-if="showOkBtn"
      >
        {{ okText }}
      </ElButton>
      <slot name="appendFooter"></slot>
    </template>

    <template v-else>
      <slot name="footer"></slot>
    </template>
  </div>
</template>

<style lang="scss" module>
  @include b(basic-drawer-footer) {
  }
</style>
