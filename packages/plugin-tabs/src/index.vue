<script setup lang="ts">
  import { ref, unref, watch } from 'vue';
  import { RouteLocationNormalized, RouteMeta, useRouter } from 'vue-router';
  import { useMultipleTab } from './use-multiple-tab';
  import { EtfmaTag } from '@etfma/etfma-ui';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'Tabs',
    inheritAttrs: false,
  });

  const { currentRoute, getRoutes, push } = useRouter();
  const { addTab, getTabList } = useMultipleTab();
  const ns = useNamespace('tabs');

  const activeKeyRef = ref('');
  const moUseActiveKey = ref('');

  watch(
    currentRoute,
    (route) => {
      const { path, fullPath, meta = {} } = route;
      const { currentActiveMenu, hideTab } = meta as RouteMeta;
      const isHide = !hideTab ? null : currentActiveMenu;
      const p = isHide || fullPath || path;
      if (activeKeyRef.value !== p) {
        activeKeyRef.value = p as string;
      }

      if (isHide) {
        const findParentRoute = getRoutes().find((item) => item.path === currentActiveMenu);

        findParentRoute && addTab(findParentRoute as unknown as RouteLocationNormalized);
      } else {
        addTab(unref(route));
      }
    },
    { immediate: true },
  );

  /**
   * 点击跳转页面
   */
  function handleClick(route: RouteLocationNormalized) {
    if (route.path !== activeKeyRef.value) {
      push(route.path);
    }
  }

  /**
   * 点击关闭
   */
  function handleClose(index: number) {
    console.log(index);
  }

  /**
   * 鼠标进入显示关闭按钮
   */
  function handleMouseenter(route: RouteLocationNormalized) {
    moUseActiveKey.value = route.path;
  }

  /**
   * 鼠标移出隐藏关闭按钮
   */
  function handleMouseleave() {
    moUseActiveKey.value = '';
  }
</script>

<template>
  <div>
    <EtfmaTag
      :class="[ns.b()]"
      v-for="(tag, index) in getTabList"
      :key="index"
      :closable="tag.path === activeKeyRef || moUseActiveKey === tag.path"
      :type="tag.path === activeKeyRef ? '' : 'info'"
      @click="handleClick(tag)"
      @close="handleClose(index)"
      @mouseenter="handleMouseenter(tag)"
      @mouseleave="handleMouseleave"
      >{{ tag.meta.title }}
    </EtfmaTag>
  </div>
</template>
<style scoped lang="scss">
  @include b(tabs) {
    margin: 4px 3px;
    cursor: pointer;
  }
</style>
