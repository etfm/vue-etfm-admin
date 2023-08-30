<script setup lang="ts">
  import { ref } from 'vue';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'AppLogo',
    inheritAttrs: false,
  });

  const ns = useNamespace('app-logo');

  const title = ref('Etfm Admin');

  const handleGoHome = () => {};
</script>
<template>
  <div :class="[ns.b()]" @click="handleGoHome">
    <img style="height: 48px" src="@/assets/images/logo.png" />

    <div :class="[ns.e('title')]">
      {{ title }}
    </div>
  </div>
</template>

<style scoped lang="scss" module>
  @include b(app-logo) {
    display: flex;
    align-items: center;
    justify-content: center;

    @include e(title) {
      overflow: hidden;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
      color: #0960bd;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.5s;
    }
  }
</style>
