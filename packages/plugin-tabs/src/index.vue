<script setup lang="ts">
  import { computed, ref, unref, watch } from 'vue';
  import { RouteLocationNormalized, RouteMeta, useRouter } from 'vue-router';
  import { useMultipleTab } from './hooks/use-multiple-tab';
  import { EtfmaTag } from '@etfma/etfma-ui';
  import Tabs from './components/tabs.vue';
  import TabPane from './components/tab-pane.vue';
  import TabOperate from './components/tab-operate.vue';
  import TabRedo from './components/tab-redo.vue';
  import { Icon } from '@etfma/icon';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'Tabs',
    inheritAttrs: false,
  });

  const router = useRouter();
  const store = useMultipleTab();
  const ns = useNamespace('tabs-main');

  const { addTab, getTabList, closeTabByKey } = store;
  const mouseActiveKey = ref('');
  const { currentRoute, getRoutes, push } = router;
  const activeKey = ref('');

  const hasClose = (route: RouteLocationNormalized) => {
    return (
      (route.fullPath === activeKey.value || mouseActiveKey.value === route.path) &&
      !!!route?.meta?.affix
    );
  };

  const getAffixKey = computed(() =>
    unref(getTabList)
      .filter((item) => item.meta.affix)
      .map((item) => item.path),
  );

  watch(
    currentRoute,
    (route) => {
      const { path, fullPath, meta = {} } = route;
      const { currentActiveMenu, hideTab } = meta as RouteMeta;
      const isHide = !hideTab ? null : currentActiveMenu;
      const p = isHide || fullPath || path;
      if (activeKey.value !== p) {
        activeKey.value = p as string;
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
  function handleClick(path: string) {
    if (path !== activeKey.value) {
      activeKey.value = path;
      push(path);
    }
  }

  /**
   * 点击关闭
   */
  function handleClose(key: string) {
    closeTabByKey(key, router);
  }

  /**
   * 鼠标进入显示关闭按钮
   */
  function handleMouseenter(route: RouteLocationNormalized) {
    mouseActiveKey.value = route.path;
  }

  /**
   * 鼠标移出隐藏关闭按钮
   */
  function handleMouseleave() {
    mouseActiveKey.value = '';
  }
</script>

<template>
  <div :class="ns.b()"> </div>
  <Tabs
    v-model:activeKey="activeKey"
    :affix="getAffixKey"
    @tabClick="handleClick"
    @dropdown-remove="handleClose"
  >
    <TabPane v-for="item in getTabList" :key="item.path" :name="item.path" :title="item.title">
      <TabOperate :store="store" trigger="contextmenu" :tabItem="item">
        <EtfmaTag
          :closable="hasClose(item)"
          :type="item.path === activeKey ? '' : 'info'"
          @close="handleClose(item.path)"
          @mouseenter="handleMouseenter(item)"
          @mouseleave="handleMouseleave"
          >{{ item.title }}
        </EtfmaTag>
      </TabOperate>
    </TabPane>
    <template #right>
      <TabRedo :store="store" />
      <TabOperate :store="store" :tabItem="currentRoute">
        <Icon :class="ns.b('arrow-down')" icon="ep:arrow-down-bold" />
      </TabOperate>
    </template>
  </Tabs>
</template>
<style scoped lang="scss">
  @include b(tabs-main-arrow-down) {
    margin: 0 8px;
  }
</style>
