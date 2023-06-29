<template>
  <div :class="[ns.b(), 'relative h-full']">
    <LayoutMenu :is-collapse="isCollapse" />
    <div class="absolute right-5 bottom-3"
      ><LayoutTrigger :is-collapse="isCollapse" @toggle="toggleCollapsed" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import LayoutMenu from '../components/menu/index.vue';
  import { useNamespace } from '@etfma/hooks';
  import LayoutTrigger from '../components/trigger/index.vue';

  defineOptions({
    name: 'LayoutSider',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * 布局方式
     * @default side-nav
     */
    layout: string;
    /**
     * 是否折起
     * @default false
     */
    isCollapse: boolean;
  }

  const emit = defineEmits<{ (event: 'toggle', collapse: boolean): void }>();

  const props = withDefaults(defineProps<Props>(), {
    layout: 'side-nav',
  });

  const ns = useNamespace('layout-menu');

  /**
   * 折叠
   * @param collapse
   */
  const toggleCollapsed = (collapse: boolean) => {
    emit('toggle', collapse);
  };
</script>
<style scoped lang="scss">
  @include b('layout-menu') {
    width: 220px;
  }
</style>
