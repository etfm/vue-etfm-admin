<script setup lang="ts">
  import { useNamespace } from '@etfm/hooks';
  import { ElSwitch, switchProps } from 'element-plus';
  import { computed } from 'vue';

  defineOptions({
    name: 'switch-item',
  });

  const { b } = useNamespace('switch-item');

  const props = defineProps({
    ...switchProps,
    title: {
      type: String,
      required: true,
    },
    activeText: {
      type: String,
      default: '开',
    },
    inactiveText: {
      type: String,
      default: '关',
    },
  });

  const valueState = computed({
    get() {
      return props.modelValue;
    },
    set(v) {
      emit('update:modelValue', v);
    },
  });

  const emit = defineEmits<{
    change: [value: any];
    'update:modelValue': [value: any];
  }>();

  function handleChange(e: any) {
    emit('change', e);
  }
</script>

<template>
  <div :class="b()">
    <span> {{ title }}</span>
    <ElSwitch v-bind="$props" v-model="valueState" inline-prompt @change="handleChange"></ElSwitch>
  </div>
</template>

<style lang="scss" module>
  @include b(switch-item) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
