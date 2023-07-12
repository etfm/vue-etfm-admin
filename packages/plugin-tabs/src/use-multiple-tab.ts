import { computed, ref, toRaw, unref } from 'vue';
import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

export function useMultipleTab() {
  const cacheTabList = ref<Set<string>>(new Set());
  const tabList = ref<RouteLocationNormalized[]>([]);
  const lastDragEndIndex = ref(0);

  const getTabList = computed(() => tabList.value);

  const getCachedTabList = computed(() => Array.from(cacheTabList.value));

  const getLastDragEndIndex = computed(() => lastDragEndIndex.value);

  /**
   * 整理router数据
   */
  function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
    if (!route) return route;
    const { matched, ...opt } = route;
    return {
      ...opt,
      matched: (matched
        ? matched.map((item) => ({
            meta: item.meta,
            name: item.name,
            path: item.path,
          }))
        : undefined) as RouteRecordNormalized[],
    };
  }

  /**
   * 添加tabs
   */
  async function addTab(route: RouteLocationNormalized) {
    const { path, fullPath, params, query, meta } = getRawRoute(route);

    let updateIndex = -1;
    // Existing pages, do not add tabs repeatedly
    const tabHasExits = unref(tabList).some((tab, index) => {
      updateIndex = index;
      return (tab.fullPath || tab.path) === (fullPath || path);
    });

    // If the tab already exists, perform the update operation
    if (tabHasExits) {
      const curTab = toRaw(tabList.value)[updateIndex];
      if (!curTab) {
        return;
      }
      curTab.params = params || curTab.params;
      curTab.query = query || curTab.query;
      curTab.fullPath = fullPath || curTab.fullPath;
      unref(tabList).splice(updateIndex, 1, curTab);
    } else {
      // Add tab
      // 获取动态路由打开数，超过 0 即代表需要控制打开数
      const dynamicLevel = (meta?.dynamicLevel ?? -1) as number;
      if (dynamicLevel > 0) {
        // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
        // 首先获取到真实的路由，使用配置方式减少计算开销.
        // const realName: string = path.match(/(\S*)\//)![1];
        const realPath = meta?.realPath ?? '';
        // 获取到已经打开的动态路由数, 判断是否大于某一个值
        if (
          unref(tabList).filter((e) => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel
        ) {
          // 关闭第一个
          const index = unref(tabList).findIndex((item) => item.meta.realPath === realPath);
          index !== -1 && unref(tabList).splice(index, 1);
        }
      }
      unref(tabList).push(route);
    }
    updateCacheTab();
  }

  /**
   * Update the cache according to the currently opened tabs
   */
  async function updateCacheTab() {
    const cacheMap: Set<string> = new Set();

    for (const tab of tabList.value) {
      const item = getRawRoute(tab);
      // Ignore the cache
      const needCache = !item.meta?.ignoreKeepAlive;
      if (!needCache) {
        continue;
      }
      const name = item.name as string;
      cacheMap.add(name);
    }
    cacheTabList.value = cacheMap;
  }

  return {
    cacheTabList,
    tabList,
    lastDragEndIndex,
    getTabList,
    getCachedTabList,
    getLastDragEndIndex,
    addTab,
  };
}
