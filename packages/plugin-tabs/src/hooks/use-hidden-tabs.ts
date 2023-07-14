import { DEFAULT_SIZE } from '../constants';
import { Ref, computed, ref, unref, watchEffect } from 'vue';
import { Tabs } from './use-get-tabs';
import { TabSizeMap } from '../types';

export function useHiddenTabs({
  tabs,
  tabOffsets,
  wrapperWidth,
  transformLeft,
}: {
  tabs: Ref<Tabs[]>;
  tabOffsets: Ref<TabSizeMap>;
  wrapperWidth: Ref<number>;
  transformLeft: Ref<number>;
}) {
  const visibleStart = ref(0);
  const visibleEnd = ref(0);

  watchEffect(() => {
    const tabOffsetsValue = tabOffsets.value;
    const basicSize = wrapperWidth.value;
    const transformSize = Math.abs(transformLeft.value);
    const mergedBasicSize = basicSize;

    const tabsVal = tabs.value;
    if (!tabsVal?.length) {
      return ([visibleStart.value, visibleEnd.value] = [0, 0]);
    }

    const len = tabsVal.length;
    let endIndex = len;
    for (let i = 0; i < len; i += 1) {
      const offset = tabOffsetsValue.get(tabsVal[i].key) || DEFAULT_SIZE;

      if (offset['left'] + offset['width'] > transformSize + mergedBasicSize) {
        endIndex = i - 1;
        break;
      }
    }
    let startIndex = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      const offset = tabOffsetsValue.get(tabsVal[i].key) || DEFAULT_SIZE;
      if (offset['left'] < transformSize) {
        startIndex = i + 1;
        break;
      }
    }

    return ([visibleStart.value, visibleEnd.value] = [startIndex, endIndex]);
  });

  const hiddenTabs = computed(() => {
    const element = [
      ...unref(tabs).slice(0, visibleStart.value),
      ...unref(tabs).slice(visibleEnd.value + 1),
    ];

    return element.map((e) => {
      return {
        key: e.name,
        title: e.title,
      };
    });
  });

  return {
    hiddenTabs,
  };
}
