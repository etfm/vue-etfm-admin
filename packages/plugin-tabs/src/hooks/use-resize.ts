import { useResizeObserver } from '@vueuse/core';
import { TabSizeMap } from '../types';
import { Ref, ref, unref, watch } from 'vue';
import { Tabs } from './use-get-tabs';

export function useResize({ tabs, props }: { tabs: Ref<Tabs[]>; props: Record<string, any> }) {
  const wrapperWidth = ref(0);
  const wrapperScrollWidth = ref(0);
  const tabSizes = ref<TabSizeMap>();
  const tabsWrapperRef = ref<HTMLDivElement | null>(null);
  const tabListRef = ref<HTMLDivElement | null>(null);

  const onListHolderResize = () => {
    const offsetWidth = tabsWrapperRef.value?.offsetWidth || 0;

    wrapperWidth.value = offsetWidth;

    const newWrapperScrollWidth = tabListRef.value?.offsetWidth || 0;

    wrapperScrollWidth.value = newWrapperScrollWidth;

    // Update buttons records
    const newSizes: TabSizeMap = new Map();
    unref(tabs).forEach((btnRef) => {
      const btnNode = btnRef?.$el || btnRef;
      if (btnNode) {
        newSizes.set(btnRef.key, {
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

  watch(
    [() => tabs.value, () => props.activeKey],
    () => {
      onListHolderResize();
    },
    { flush: 'post' },
  );

  return {
    wrapperWidth,
    wrapperScrollWidth,
    tabSizes,
    tabsWrapperRef,
    tabListRef,
  };
}
