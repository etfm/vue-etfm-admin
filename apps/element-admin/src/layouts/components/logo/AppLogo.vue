<script setup lang="ts">
  import { ref } from 'vue';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'AppLogo',
  });

  const ns = useNamespace('app-logo');

  const title = ref('Etfm Admin');

  const handleGoHome = () => {};
</script>
<template>
  <div :class="[ns.b()]" @click="handleGoHome">
    <img style="height: 60px" src="@/assets/images/logo.png" />

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
