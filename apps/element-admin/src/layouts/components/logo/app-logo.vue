<template>
  <div :class="[ns.b()]" @click="handleGoHome">
    <img style="height: 60px" src="@/assets/images/logo.png" />

    <div :class="[ns.e('title')]">
      {{ title }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useNamespace } from '@etfm/vea-hooks'

const ns = useNamespace('app-logo')

const title = ref('Etfm Admin')

const handleGoHome = () => {}
</script>
<style scoped lang="scss">
@use '@etfm/vea-styles' as *;

@include b(app-logo) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 210px;

  @include e(title) {
    color: #0960bd;
    font-size: 16px;
    font-weight: 700;
    transition: all 0.5s;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
