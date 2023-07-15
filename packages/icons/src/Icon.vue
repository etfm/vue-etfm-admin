<script setup lang="ts">
  import iconify from '@purge-icons/generated';
  import { computed, type CSSProperties, nextTick, onMounted, ref, unref, watch } from 'vue';

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

    /**
     * @description 图标旋转
     * @default false
     */
    spin?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 16,
    namespace: '',
    color: '',
    spin: false,
  });

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
      span.className = 'iconify';
      span.dataset.icon = icon;
      iconElement.textContent = '';
      iconElement.appendChild(span);
    }
  }

  onMounted(update);
</script>

<template>
  <span
    ref="iconRef"
    v-bind="$attrs"
    :class="[$attrs.class, 'app-iconify', spin && 'app-iconify-spin']"
    :style="iconStyles"
  >
  </span>
</template>

<style lang="scss">
  .app-iconify {
    display: inline-block;
    vertical-align: middle;

    &-spin {
      svg {
        animation: loading 1s infinite linear;
      }
    }
  }

  @keyframes loading {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  span.iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    background-color: #5551;
    border-radius: 100%;
  }
</style>
