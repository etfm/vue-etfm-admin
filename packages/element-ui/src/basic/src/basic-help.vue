<template>
  <ElTooltip :class="[ns.e('wrap')]" :placement="props.placement">
    <template #content>
      <span :class="[ns.b()]"> </span>
    </template>
    <slot v-if="hasSlot" />
    <Warning v-else />
  </ElTooltip>
</template>
<script setup lang="ts">
  import { ElTooltip } from 'element-plus';
  import { useNamespace } from '@etfma/hooks';
  import { useSlots, computed } from 'vue';
  import { lodash } from '@etfma/shared';
  import { Warning } from '@element-plus/icons-vue';
  import { basicHelpProps } from './props';

  const slots = useSlots();

  const props = defineProps(basicHelpProps);

  const ns = useNamespace('basic-help');

  const hasSlot = computed(() => {
    if (!slots || !Reflect.has(slots, 'default')) {
      return false;
    }

    if (!lodash.isFunction(slots['default'])) {
      console.error(`default is not a function!`);
      return false;
    }

    return true;
  });
</script>
<style module lang="scss"></style>
