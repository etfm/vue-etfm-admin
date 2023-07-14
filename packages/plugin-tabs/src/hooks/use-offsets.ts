import { Ref, unref } from 'vue';
import { ref, watchEffect } from 'vue';
import { TabOffset, TabOffsetMap, TabSizeMap } from '../types';
import { Tabs } from './use-get-tabs';
import { DEFAULT_SIZE } from '../constants';

export default function useOffsets(
  tabs: Ref<Tabs[]>,
  tabSizes: Ref<TabSizeMap | undefined>,
): Ref<TabOffsetMap> {
  const offsetMap = ref<TabOffsetMap>(new Map());
  watchEffect(() => {
    const map: TabOffsetMap = new Map();
    const tabsValue = tabs.value;

    if (tabsValue.length === 0) return;

    const lastOffset = unref(tabSizes)?.get(tabsValue[0].key) || DEFAULT_SIZE;
    const rightOffset = lastOffset.left + lastOffset.width;

    for (let i = 0; i < tabsValue.length; i += 1) {
      const key = tabsValue[i].key;

      let data = unref(tabSizes)?.get(key);

      // Reuse last one when not exist yet
      if (!data) {
        data = unref(tabSizes)?.get(tabsValue[i - 1]?.key) || DEFAULT_SIZE;
      }

      const entity = (map.get(key) || { ...data }) as TabOffset;

      entity.right = rightOffset - entity.left - entity.width;

      map.set(key, entity);
    }
    offsetMap.value = new Map(map);
  });

  return offsetMap;
}
