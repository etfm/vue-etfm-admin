import { useGo, useRedo } from '@etfma/core';
import { ComputedRef, Ref, computed, ref, toRaw, unref } from 'vue';
import {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteRecordNormalized,
  Router,
} from 'vue-router';
import { useRouter } from 'vue-router';

export interface TabMeta extends RouteLocationNormalized {
  title: string;
}

export interface PublicMultipleTab {
  cacheTabList: Ref<Set<string>>;
  tabList: Ref<RouteLocationNormalized[]>;
  getTabList: ComputedRef<TabMeta[]>;
  getCachedTabList: ComputedRef<string[]>;
  lastDragEndIndex: Ref<number>;
  getLastDragEndIndex: ComputedRef<number>;
  addTab: (route: RouteLocationNormalized) => Promise<void>;
  closeTabByKey: (key: string, router: Router) => Promise<void>;
  refresh: (router: Router) => Promise<void>;
  closeTab: (tab: RouteLocationNormalized, router: Router) => Promise<void>;
  closeLeftTabs: (route: RouteLocationNormalized, router: Router) => Promise<void>;
  closeRightTabs: (route: RouteLocationNormalized, router: Router) => Promise<void>;
  closeAllTab: (router: Router) => Promise<void>;
  closeOtherTabs: (route: RouteLocationNormalized, router: Router) => Promise<void>;
  resetState: () => void;
}

export function useMultipleTab(): PublicMultipleTab {
  const { getRoutes } = useRouter();

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
   * affix为true，页面加载应就显示
   */
  function initDefaultAffix() {
    const routes = getRoutes();

    routes.forEach((route: any) => route && route.meta && route.meta.affix && addTab(route));
  }

  initDefaultAffix();

  /**
   * 获取affix数据
   * 这里需要监听路由物料的变化
   * TODO 待优化
   */
  // material.onChangeAssets('routes', (e: RouteLocationNormalized[]) => {
  //   const routeList = findPath(e, (route: RouteLocationNormalized) => {
  //     if (route?.meta?.affix) {
  //       return true;
  //     }
  //   });

  //   let path = '';
  //   routeList.forEach((route: RouteLocationNormalized) => {
  //     path += `${route.path}/`;
  //   });

  //   const startFlag = path.startsWith('/');
  //   if (!startFlag) {
  //     path += '/';
  //   }

  //   const endFlag = path.endsWith('/');
  //   if (endFlag) {
  //     path = path.substring(0, path.lastIndexOf('/'));
  //   }

  //   const index = routeList.length > 0 ? routeList.length - 1 : 0;
  //   const name = routeList[index].name;
  //   const meta = routeList[index].meta;

  //   unref(tabList).unshift({
  //     path,
  //     fullPath: path,
  //     matched: [],
  //     query: {},
  //     hash: '',
  //     redirectedFrom: undefined,
  //     name,
  //     params: {},
  //     meta,
  //   });
  // });

  /**
   * 添加tabs
   */
  async function addTab(route: RouteLocationNormalized) {
    const { path, fullPath, params, query, meta } = getRawRoute(route);

    if (meta.hideTab) {
      return;
    }

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

  /**
   * @description 通过key删除tab
   * @param key
   * @param router
   */
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

  /**
   * @description 关闭tab
   * @param tab
   * @param router
   * @returns
   */
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

  /**
   * @description 刷新tab对应page
   * @param params
   */
  async function refresh(router: Router) {
    const { currentRoute } = router;
    const route = unref(currentRoute);
    const name = route.name;

    const findTab = unref(getCachedTabList).find((item) => item === name);
    if (findTab) {
      unref(cacheTabList).delete(findTab);
    }
    const redo = useRedo(router);
    await redo();
  }

  async function closeLeftTabs(route: RouteLocationNormalized, router: Router) {
    const index = unref(tabList).findIndex((item) => item.path === route.path);

    if (index > 0) {
      const leftTabs = unref(tabList).slice(0, index);
      const pathList: string[] = [];
      for (const item of leftTabs) {
        const affix = item?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      bulkCloseTabs(pathList);
    }
    updateCacheTab();
    handleGotoPage(router);
  }

  async function closeRightTabs(route: RouteLocationNormalized, router: Router) {
    const index = unref(tabList).findIndex((item) => item.fullPath === route.fullPath);

    if (index >= 0 && index < unref(tabList).length - 1) {
      const rightTabs = unref(tabList).slice(index + 1, unref(tabList).length);

      const pathList: string[] = [];
      for (const item of rightTabs) {
        const affix = item?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      bulkCloseTabs(pathList);
    }
    updateCacheTab();
    handleGotoPage(router);
  }

  async function closeAllTab(router: Router) {
    tabList.value = unref(tabList).filter((item) => item?.meta?.affix ?? false);
    clearCacheTabs();
    goToPage(router);
  }

  async function closeOtherTabs(route: RouteLocationNormalized, router: Router) {
    const closePathList = unref(tabList).map((item) => item.fullPath);

    const pathList: string[] = [];

    for (const path of closePathList) {
      if (path !== route.fullPath) {
        const closeItem = unref(tabList).find((item) => item.path === path);
        if (!closeItem) {
          continue;
        }
        const affix = closeItem?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(closeItem.fullPath);
        }
      }
    }
    bulkCloseTabs(pathList);
    updateCacheTab();
    handleGotoPage(router);
  }

  function bulkCloseTabs(pathList: string[]) {
    tabList.value = unref(tabList).filter((item) => !pathList.includes(item.fullPath));
  }

  function handleGotoPage(router: Router) {
    const go = useGo(router);
    go(unref(router.currentRoute).fullPath, true);
  }

  function clearCacheTabs(): void {
    cacheTabList.value = new Set();
  }
  function resetState(): void {
    tabList.value = [];
    clearCacheTabs();
  }
  function goToPage(router: Router) {
    const go = useGo(router);
    const len = tabList.value.length;
    const { path } = unref(router.currentRoute);

    let toPath: string = '';

    if (len > 0) {
      const page = unref(tabList)[len - 1];
      const p = page.fullPath || page.path;
      if (p) {
        toPath = p;
      }
    }

    if (toPath) {
      // Jump to the current page and report an error
      path !== toPath && go(toPath, true);
    }
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
    refresh,
    closeTab,
    closeLeftTabs,
    closeRightTabs,
    closeAllTab,
    closeOtherTabs,
    resetState,
  };
}
