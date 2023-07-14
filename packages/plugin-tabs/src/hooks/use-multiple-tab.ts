import { computed, ref, toRaw, unref } from 'vue';
import {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteRecordNormalized,
  Router,
} from 'vue-router';
import { material } from '@etfma/core';
import { findPath } from '@etfma/shared';

export interface TabMeta extends RouteLocationNormalized {
  title: string;
}

export function useMultipleTab() {
  const cacheTabList = ref<Set<string>>(new Set());
  const tabList = ref<RouteLocationNormalized[]>([]);
  const lastDragEndIndex = ref(0);

  const getTabList = computed(() =>
    unref(tabList).map(
      (item) =>
        ({
          ...item,
          ...(item.meta ? item.meta : {}),
        } as TabMeta),
    ),
  );

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

  const getToTarget = (tabItem: RouteLocationNormalized) => {
    const { params, path, query } = tabItem;

    return {
      params: params || {},
      path,
      query: query || {},
    };
  };

  /**
   * 获取affix数据
   * 这里需要监听路由物料的变化
   */
  material.onChangeAssets('routes', (e: RouteLocationNormalized[]) => {
    const routeList = findPath(e, (route: RouteLocationNormalized) => {
      if (route?.meta?.affix) {
        return true;
      }
    });

    let path = '';
    routeList.forEach((route: RouteLocationNormalized) => {
      path += `${route.path}/`;
    });

    const startFlag = path.startsWith('/');
    if (!startFlag) {
      path += '/';
    }

    const endFlag = path.endsWith('/');
    if (endFlag) {
      path = path.substring(0, path.lastIndexOf('/'));
    }

    const index = routeList.length > 0 ? routeList.length - 1 : 0;
    const name = routeList[index].name;
    const meta = routeList[index].meta;

    unref(tabList).unshift({
      path,
      fullPath: path,
      matched: [],
      query: {},
      hash: '',
      redirectedFrom: undefined,
      name,
      params: {},
      meta,
    });
  });

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

  async function closeTabByKey(key: string, router: Router) {
    const index = unref(tabList).findIndex((item) => (item.fullPath || item.path) === key);
    if (index !== -1) {
      await closeTab(unref(tabList)[index], router);
      const { currentRoute, replace } = router;
      // 检查当前路由是否存在于tabList中
      const isActivated = unref(tabList).findIndex((item) => {
        return item.fullPath === currentRoute.value.fullPath;
      });
      // 如果当前路由不存在于TabList中，尝试切换到其它路由
      if (isActivated === -1) {
        let pageIndex;
        if (index > 0) {
          pageIndex = index - 1;
        } else if (index < unref(tabList).length - 1) {
          pageIndex = index + 1;
        } else {
          pageIndex = -1;
        }
        if (pageIndex >= 0) {
          const page = unref(tabList)[index - 1];
          const toTarget = getToTarget(page);
          await replace(toTarget);
        }
      }
    }
  }

  async function closeTab(tab: RouteLocationNormalized, router: Router) {
    const close = (route: RouteLocationNormalized) => {
      const { fullPath, meta: { affix } = {} } = route;
      if (affix) {
        return;
      }
      const index = unref(tabList).findIndex((item) => item.fullPath === fullPath);
      index !== -1 && unref(tabList).splice(index, 1);
    };

    const { currentRoute, replace } = router;

    const { path } = unref(currentRoute);
    if (path !== tab.path) {
      // Closed is not the activation tab
      close(tab);
      updateCacheTab();
      return;
    }

    // Closed is activated atb
    let toTarget: RouteLocationRaw = {};

    const index = unref(tabList).findIndex((item) => item.path === path);

    // If the current is the leftmost tab
    if (index === 0) {
      //  Jump to the right tab
      const page = unref(tabList)[index];
      toTarget = getToTarget(page);
    } else {
      // Close the current tab
      const page = unref(tabList)[index - 1];
      toTarget = getToTarget(page);
    }
    close(currentRoute.value);
    await replace(toTarget);
  }

  return {
    cacheTabList,
    tabList,
    lastDragEndIndex,
    getTabList,
    getCachedTabList,
    getLastDragEndIndex,
    addTab,
    closeTabByKey,
  };
}
