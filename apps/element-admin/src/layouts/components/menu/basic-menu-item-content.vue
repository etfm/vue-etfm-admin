<template>
  <div class="">{{}}</div>
</template>
<script setup lang="ts">
import type { IBasiMenuItemContent } from './type'

const props = withDefaults(defineProps<IBasiMenuItemContent>(), {
  showTitle: true,
  level: 0,
  isHorizontal: true
})
</script>
