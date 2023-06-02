<template>
  <div :class="[ns.b(), 'relative h-full']">
    <AppLogo v-if="hasLogo" />
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
  import AppLogo from '../components/logo/AppLogo.vue';
  import { computed } from 'vue';

  defineOptions({
    name: 'LayoutSider',
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

  const hasLogo = computed(() => props.layout === 'side-nav');

  /**
   * 折叠
   * @param collapse
   */
  const toggleCollapsed = (collapse: boolean) => {
    emit('toggle', collapse);
  };
</script>
<style scoped lang="scss" module>
  @include b('layout-menu') {
  }
</style>
