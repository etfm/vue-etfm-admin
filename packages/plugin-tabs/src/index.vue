<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, unref, watch, watchEffect } from 'vue';
  import { RouteLocationNormalized, RouteMeta, useRouter } from 'vue-router';
  import { useMultipleTab } from './use-multiple-tab';
  import { EtfmaTag } from '@etfma/etfma-ui';
  import { useNamespace } from '@etfma/hooks';
  import useTouchMove from './use-touch-move';
  import { useResizeObserver } from '@vueuse/core';
  import { TabSizeMap } from './types';
  import useOffsets from './use-offsets';

  defineOptions({
    name: 'Tabs',
    inheritAttrs: false,
  });

  const router = useRouter();
  const { addTab, getTabList, closeTabByKey } = useMultipleTab();
  const ns = useNamespace('tabs');

  const activeKeyRef = ref('');
  const mouseActiveKey = ref('');
  const { currentRoute, getRoutes, push } = router;
  const tabsWrapperRef = ref();
  const tabListRef = ref();
  const wrapperWidth = ref(0);
  const wrapperHeight = ref(0);
  const wrapperScrollWidth = ref(0);
  const wrapperScrollHeight = ref(0);

  const transformMin = ref(0);
  const transformMax = ref(0);

  const transformLeft = ref(0);

  const touchMovingRef = ref();

  const lockAnimation = ref();

  const btnRefs = ref<any>([]);
  const tabSizes = ref<TabSizeMap>();

  const tabOffsets = useOffsets(btnRefs, tabSizes);

  const activeKey = ref();

  const visibleStart = ref(0);
  const visibleEnd = ref(0);

  const DEFAULT_SIZE = { width: 0, height: 0, left: 0, top: 0, right: 0 };

  // const hasClose = (route: RouteLocationNormalized) => {
  //   return (
  //     (route.fullPath === activeKeyRef.value || mouseActiveKey.value === route.path) &&
  //     !!!route.meta.affix
  //   );
  // };

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
  function handleClick(route: RouteLocationNormalized, index: number) {
    activeKey.value = `tag-${index}`;

    scrollToTab(activeKey.value);
    // if (route.path !== activeKeyRef.value) {
    //   push(route.path);
    // }
  }

  /**
   * 点击关闭
   */
  // function handleClose(key: string) {
  //   closeTabByKey(key, router);
  // }

  /**
   * 鼠标进入显示关闭按钮
   */
  // function handleMouseenter(route: RouteLocationNormalized) {
  //   mouseActiveKey.value = route.path;
  // }

  /**
   * 鼠标移出隐藏关闭按钮
   */
  // function handleMouseleave() {
  //   mouseActiveKey.value = '';
  // }

  watchEffect(() => {
    transformMin.value = Math.min(0, wrapperWidth.value - wrapperScrollWidth.value);
    transformMax.value = 0;
  });

  const alignInRange = (value: number): number => {
    if (value < transformMin.value) {
      return transformMin.value;
    }
    if (value > transformMax.value) {
      return transformMax.value;
    }
    return value;
  };

  const doMove = (defaultVlaue: number, offset: number) => {
    transformLeft.value = alignInRange(defaultVlaue + offset);
  };

  watch(lockAnimation, () => {
    clearTouchMoving();
    if (lockAnimation.value) {
      touchMovingRef.value = setTimeout(() => {
        lockAnimation.value = 0;
      }, 100);
    }
  });

  onBeforeUnmount(() => {
    clearTouchMoving();
  });

  const scrollToTab = (key = activeKey.value) => {
    const tabOffset = unref(tabOffsets)?.get(key) || {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
    };
    // ============ Align with top & bottom ============
    let newTransform = transformLeft.value;

    if (tabOffset.left < -transformLeft.value) {
      newTransform = -tabOffset.left;
    } else if (tabOffset.left + tabOffset.width > -transformLeft.value + wrapperWidth.value) {
      newTransform = -(tabOffset.left + tabOffset.width - wrapperWidth.value);
    }

    transformLeft.value = alignInRange(newTransform);
  };

  useTouchMove(tabsWrapperRef, (offsetX) => {
    if (wrapperWidth.value >= wrapperScrollWidth.value) {
      return false;
    }

    doMove(transformLeft.value, offsetX);

    clearTouchMoving();
    doLockAnimation();

    return true;
  });

  watch(
    [() => getTabList.value, tabOffsets],
    () => {
      scrollToTab();
    },
    { flush: 'post' },
  );

  watch(
    [() => getTabList.value],
    () => {
      onListHolderResize();
    },
    { flush: 'post' },
  );

  watchEffect(() => {
    // let unit: 'width' | 'height';
    // let basicSize: number;

    const tabOffsetsValue = tabOffsets.value;

    const basicSize = wrapperWidth.value;

    const transformSize = Math.abs(transformLeft.value);
    const mergedBasicSize = basicSize;

    const tabsVal = btnRefs.value;
    if (!tabsVal?.length) {
      return ([visibleStart.value, visibleEnd.value] = [0, 0]);
    }

    const len = tabsVal.length;
    let endIndex = len;
    for (let i = 0; i < len; i += 1) {
      const offset = tabOffsetsValue.get(tabsVal[i].dataset.key) || DEFAULT_SIZE;

      if (offset['left'] + offset['width'] > transformSize + mergedBasicSize) {
        endIndex = i - 1;
        break;
      }
    }
    let startIndex = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      const offset = tabOffsetsValue.get(tabsVal[i].dataset.key) || DEFAULT_SIZE;
      if (offset['left'] < transformSize) {
        startIndex = i + 1;
        break;
      }
    }

    return ([visibleStart.value, visibleEnd.value] = [startIndex, endIndex]);
  });

  const hiddenTabs = computed(() => {
    const aaa = [
      ...unref(btnRefs).slice(0, visibleStart.value),
      ...unref(btnRefs).slice(visibleEnd.value + 1),
    ];
    console.log(aaa, '=====');

    return aaa;
  });

  const doLockAnimation = () => {
    lockAnimation.value = Date.now();
  };

  const clearTouchMoving = () => {
    clearTimeout(touchMovingRef.value);
  };

  const onListHolderResize = () => {
    // Update wrapper records
    const offsetWidth = tabsWrapperRef.value?.offsetWidth || 0;
    const offsetHeight = tabsWrapperRef.value?.offsetHeight || 0;

    wrapperWidth.value = offsetWidth;
    wrapperHeight.value = offsetHeight;

    const newWrapperScrollWidth = tabListRef.value?.offsetWidth || 0;
    const newWrapperScrollHeight = tabListRef.value?.offsetHeight || 0;

    wrapperScrollWidth.value = newWrapperScrollWidth;
    wrapperScrollHeight.value = newWrapperScrollHeight;

    // Update buttons records
    const newSizes: TabSizeMap = new Map();
    unref(btnRefs).forEach((btnRef) => {
      const btnNode = (btnRef as any)?.$el || btnRef;
      if (btnNode) {
        const key = btnNode.dataset.key;
        newSizes.set(key, {
          width: btnNode.offsetWidth,
          height: btnNode.offsetHeight,
          left: btnNode.offsetLeft,
          top: btnNode.offsetTop,
        });
      }
    });
    tabSizes.value = newSizes;
  };

  useResizeObserver(tabsWrapperRef, onListHolderResize);
  useResizeObserver(tabListRef, onListHolderResize);
</script>
<!-- :closable="hasClose(tag)"
:type="tag.path === activeKeyRef ? '' : 'info'"
@click="handleClick(tag)"
@close="handleClose(tag.fullPath)"
@mouseenter="handleMouseenter(tag)"
@mouseleave="handleMouseleave" -->
<template>
  <div :class="ns.b()">
    <div ref="tabsWrapperRef" :class="ns.b('wrap')">
      <div
        ref="tabListRef"
        :class="[ns.b('list')]"
        :style="{
          transform: `translate(${transformLeft}px, 0px)`,
          transition: lockAnimation ? 'none' : undefined,
        }"
      >
        <div
          ref="btnRefs"
          :data-key="`tag-${index}`"
          :class="[ns.b('tag')]"
          v-for="index in 30"
          :key="index"
          :data-aaa="hiddenTabs"
        >
          <EtfmaTag @click="handleClick(tag, index)">{{ index }} 测试 </EtfmaTag>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>
<style scoped lang="scss">
  @include b(tabs) {
    width: 200px;

    @include b(tabs-wrap) {
      position: relative;
      display: inline-block;
      display: flex;
      flex: auto;
      align-self: stretch;
      overflow: hidden;
      white-space: nowrap;
      transform: translate(0);
    }

    @include b(tabs-list) {
      position: relative;
      display: flex;
      white-space: nowrap;
      transition: transform 0.3s;
    }

    @include b(tabs-tag) {
      margin: 4px 3px;
      cursor: pointer;
    }
  }
</style>
