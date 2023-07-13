import { Ref, unref } from 'vue';
import { ref, watchEffect } from 'vue';
import { TabOffset, TabOffsetMap, TabSizeMap } from './types';

const DEFAULT_SIZE = { width: 0, height: 0, left: 0, top: 0 };

export default function useOffsets(
  tabs: Ref<any[]>,
  tabSizes: Ref<TabSizeMap | undefined>,
  // holderScrollWidth: Ref<number>,
): Ref<TabOffsetMap> {
  const offsetMap = ref<TabOffsetMap>(new Map());
  watchEffect(() => {
    const map: TabOffsetMap = new Map();
    const tabsValue = tabs.value;

    if (tabsValue.length === 0) return;

    const lastOffset = unref(tabSizes)?.get(tabsValue[0].dataset.key) || DEFAULT_SIZE;
    const rightOffset = lastOffset.left + lastOffset.width;

    for (let i = 0; i < tabsValue.length; i += 1) {
      const { key } = tabsValue[i].dataset;

      let data = unref(tabSizes)?.get(key);

      // Reuse last one when not exist yet
      if (!data) {
        data = unref(tabSizes)?.get(tabsValue[i - 1]?.dataset.key) || DEFAULT_SIZE;
      }

      const entity = (map.get(key) || { ...data }) as TabOffset;

      // Right
      entity.right = rightOffset - entity.left - entity.width;

      // Update entity
      map.set(key, entity);
    }
    offsetMap.value = new Map(map);
  });

  return offsetMap;
}
