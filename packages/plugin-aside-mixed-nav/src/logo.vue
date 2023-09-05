<script setup lang="ts">
  import { CSSProperties, computed, onUnmounted, reactive } from 'vue';
  import { useNamespace } from '@etfm/hooks';
  import { config, event } from 'etfm-engine';

  defineOptions({
    name: 'AsideMixedNavLogo',
    inheritAttrs: false,
  });

  interface Props {
    image?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    image: '',
  });

  const ns = useNamespace('aside-mixed-nav-logo');

  const model = reactive({
    height: 0,
    width: 0,
    image: props.image,
  });

  config.onGot('layout.headerHeight', (h) => {
    model.height = h;
  });

  config.onGot('layout.sideMixedWidth', (w) => {
    model.width = w;
  });

  const disposeImage = event.on('aside-mixed-nav:image', (e) => {
    model.image = e;
  });

  onUnmounted(() => {
    disposeImage();
  });

  const style = computed<CSSProperties>(() => {
    return {
      height: `${model.height}px`,
      width: '100%',
    };
  });

  const imgStyle = computed<CSSProperties>(() => {
    return {
      height: `${model.height}px`,
    };
  });

  const handleGoHome = () => {
    event.emit('aside-mixed-nav-logo:click');
  };
</script>
<template>
  <div :class="[ns.b()]" :style="style" @click="handleGoHome">
    <img :style="imgStyle" :src="model.image" />
  </div>
</template>

<style scoped lang="scss" module>
  @include b(aside-mixed-nav-logo) {
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
