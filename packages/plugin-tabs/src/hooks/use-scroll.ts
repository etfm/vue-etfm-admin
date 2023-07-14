import { Ref, unref, watch } from 'vue';
import { Tabs } from './use-get-tabs';
import { TabSizeMap } from '../types';

export function useScroll({
  props,
  tabs,
  tabOffsets,
  transformLeft,
  wrapperWidth,
  alignInRange,
}: {
  props: Record<string, any>;
  tabs: Ref<Tabs[]>;
  tabOffsets: Ref<TabSizeMap>;
  transformLeft: Ref<number>;
  wrapperWidth: Ref<number>;
  alignInRange: (value: number) => number;
}) {
  watch(
    [() => tabs.value, () => tabOffsets.value, () => props.activeKey],
    () => {
      scrollToTab();
    },
    { flush: 'post' },
  );

  const scrollToTab = (key = props.activeKey) => {
    const tabOffset = unref(tabOffsets)?.get(key) || {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
    };
    let newTransform = transformLeft.value;

    if (tabOffset.left < -transformLeft.value) {
      newTransform = -tabOffset.left;
    } else if (tabOffset.left + tabOffset.width > -transformLeft.value + wrapperWidth.value) {
      newTransform = -(tabOffset.left + tabOffset.width - wrapperWidth.value);
    }

    transformLeft.value = alignInRange(newTransform);
  };

  return {
    scrollToTab,
  };
}
