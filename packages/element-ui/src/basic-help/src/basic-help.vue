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
import { ElTooltip } from 'element-plus'
import type { IBasicHelp } from '..'
import { useNamespace } from '@etfma/hooks'
import { useSlots, computed } from 'vue'
import { lodash } from '@etfma/shared'
import { Warning } from '@element-plus/icons-vue'

const slots = useSlots()

const props = withDefaults(defineProps<IBasicHelp>(), {
  placement: 'right'
})

const ns = useNamespace('basic-help')

const hasSlot = computed(() => {
  if (!slots || !Reflect.has(slots, 'default')) {
    return false
  }

  if (!lodash.isFunction(slots['default'])) {
    console.error(`default is not a function!`)
    return false
  }

  return true
})
</script>
<style scoped lang="scss"></style>
