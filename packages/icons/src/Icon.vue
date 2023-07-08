<script setup lang="ts">
  import iconify from '@purge-icons/generated';
  import {
    computed,
    type CSSProperties,
    nextTick,
    onMounted,
    ref,
    unref,
    useCssModule,
    watch,
  } from 'vue';

  defineOptions({
    name: 'Icon',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * @description 图标名
     */
    icon: string;

    /**
     * @description 图标颜色
     * @default ''
     */
    color?: string;

    /**
     * @description 图标大小
     * @default 16
     */
    size?: number;

    /**
     * @description 图标集空间名
     * @default ''
     */
    namespace?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 16,
    namespace: '',
    color: '',
  });

  const $style = useCssModule();

  const iconRef = ref<HTMLSpanElement>();

  const iconName = computed(() => {
    const { namespace, icon } = props;
    return `${namespace ? namespace + ':' : ''}${icon}`;
  });

  const iconStyles = computed((): CSSProperties => {
    const { size, color } = props;
    return {
      fontSize: `${size}px`,
      color,
      display: 'inline-flex',
    };
  });

  watch(() => props.icon, update, { flush: 'post' });

  async function update() {
    const iconElement = unref(iconRef);
    if (!iconElement) {
      return;
    }

    await nextTick();
    const icon = unref(iconName);

    const svg = iconify.renderSVG(icon, {});
    if (svg) {
      iconElement.textContent = '';
      iconElement.appendChild(svg);
    } else {
      const span = document.createElement('span');
      span.className = $style.iconify;
      span.dataset.icon = icon;
      iconElement.textContent = '';
      iconElement.appendChild(span);
    }
  }

  onMounted(update);
</script>

<template>
  <i ref="iconRef" v-bind="$attrs" :class="$style.icon" :style="iconStyles">
    <slot v-if="!icon" />
  </i>
</template>

<style module scoped lang="scss">
  .icon {
    display: inline-block;
  }

  .iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    background-color: #5551;
    border-radius: 100%;
  }
</style>
