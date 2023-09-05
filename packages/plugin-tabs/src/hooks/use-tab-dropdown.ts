import { computed, unref, reactive } from 'vue';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { Nullable } from '@etfm/types';
import { PublicMultipleTab } from './use-multiple-tab';
import { OP_TYPE } from '../constants';

export function useTabDropdown(props: any, store: PublicMultipleTab) {
  const state = reactive({
    current: null as Nullable<RouteLocationNormalized>,
    currentIndex: 0,
  });

  const router = useRouter();
  const { currentRoute } = router;

  const getTargetTab = computed((): RouteLocationNormalized => {
    return props.tabItem;
  });

  /**
   * @description: drop-down list
   */
  const getDropMenuList = computed(() => {
    if (!unref(getTargetTab)) {
      return;
    }

    const { meta } = unref(getTargetTab);
    const { path } = unref(currentRoute);

    const curItem = state.current;

    const isCurItem = curItem ? curItem.path === path : false;

    // Refresh button
    const index = state.currentIndex;
    const refreshDisabled = !isCurItem;
    // Close left
    const closeLeftDisabled = index === 0 || !isCurItem;

    const disabled = unref(store.getTabList).length === 1;

    // Close right
    const closeRightDisabled =
      !isCurItem ||
      (index === unref(store.getTabList).length - 1 && store.getLastDragEndIndex.value >= 0);

    const dropMenuList = [
      {
        key: OP_TYPE.REFRESH,
        title: '重新加载',
        icon: 'material-symbols:restart-alt',
        disabled: refreshDisabled,
      },
      {
        key: OP_TYPE.CLOSE_CURRENT,
        title: '关闭标签页',
        icon: 'material-symbols:close',
        disabled: !!meta?.affix || disabled,
        divider: true,
      },
      {
        key: OP_TYPE.CLOSE_LEFT,
        title: '关闭左侧标签页',
        icon: 'material-symbols:first-page',
        disabled: closeLeftDisabled,
        divider: false,
      },
      {
        key: OP_TYPE.CLOSE_RIGHT,
        title: '关闭右侧标签页',
        icon: 'material-symbols:last-page',
        disabled: closeRightDisabled,
        divider: true,
      },
      {
        key: OP_TYPE.CLOSE_OTHER,
        title: '关闭其它标签页',
        icon: 'material-symbols:align-justify-center',
        disabled: disabled || !isCurItem,
      },
      {
        key: OP_TYPE.CLOSE_ALL,
        title: '关闭全部标签页',
        icon: 'material-symbols:remove',
        disabled: disabled,
      },
    ];

    return dropMenuList;
  });

  function handleContextMenu(tabItem: RouteLocationNormalized) {
    if (!tabItem) {
      return;
    }

    const index = unref(store.getTabList).findIndex((tab) => tab.path === tabItem.path);

    state.current = tabItem;
    state.currentIndex = index;
  }

  // Handle right click event
  function handleMenuEvent(event): void {
    switch (event) {
      case OP_TYPE.REFRESH:
        // refresh page
        store.refresh(router);
        break;
      // Close current
      case OP_TYPE.CLOSE_CURRENT:
        store.closeTab(unref(getTargetTab), router);
        break;
      // Close left
      case OP_TYPE.CLOSE_LEFT:
        store.closeLeftTabs(unref(getTargetTab), router);
        break;
      // Close right
      case OP_TYPE.CLOSE_RIGHT:
        store.closeRightTabs(unref(getTargetTab), router);
        break;
      // Close other
      case OP_TYPE.CLOSE_OTHER:
        store.closeOtherTabs(unref(getTargetTab), router);
        break;
      // Close all
      case OP_TYPE.CLOSE_ALL:
        store.closeAllTab(router);
        break;
      default:
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent, handleContextMenu };
}
