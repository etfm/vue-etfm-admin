<script setup lang="ts">
  import { CSSProperties, computed, onUnmounted, reactive } from 'vue';
  import { useNamespace } from '@etfm/hooks';
  import { config, event } from 'etfm-engine';

  defineOptions({
    name: 'AsideNavLogo',
    inheritAttrs: false,
  });

  interface Props {
    title?: string;
    image?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    image: '',
  });

  const ns = useNamespace('aside-nav-logo');

  const model = reactive({
    height: 0,
    width: 0,
    title: props.title,
    image: props.image,
  });

  config.onGot('layout.headerHeight', (h) => {
    model.height = h;
  });

  config.onGot('layout.sideWidth', (w) => {
    model.width = w;
  });

  const disposeTitle = event.on('aside-nav:title', (e) => {
    model.title = e;
  });

  const disposeImage = event.on('aside-nav:image', (e) => {
    model.image = e;
  });

  onUnmounted(() => {
    disposeTitle();
    disposeImage();
  });

  const style = computed<CSSProperties>(() => {
    return {
      height: `${model.height}px`,
    };
  });

  const imgStyle = computed<CSSProperties>(() => {
    return {
      height: `${model.height}px`,
    };
  });

  const handleGoHome = () => {
    event.emit('aside-nav-logo:click');
  };
</script>
<template>
  <div :class="[ns.b()]" :style="style" @click="handleGoHome">
    <img :style="imgStyle" :src="model.image" />

    <div :class="[ns.e('title')]">
      {{ model.title }}
    </div>
  </div>
</template>

<style scoped lang="scss" module>
  @include b(aside-nav-logo) {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;

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
