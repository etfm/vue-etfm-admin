/**
 * Used to monitor routing changes to change the status of menus and tabs. There is no need to monitor the route, because the route status change is affected by the page rendering time, which will be slow
 * 用于监视路由更改，以更改菜单和选项卡的状态。不需要监视路由，因为路由状态的更改会受到页面呈现时间的影响，这会很慢
 */

import { mitt } from '@etfma/shared';
import type { MenuRecordRaw } from '@etfma/types';

const emitter = mitt();

const key = Symbol('router-change');

let lastChangeTab: MenuRecordRaw;

export function setRouteChange(lastChangeRoute: MenuRecordRaw) {
  lastChangeTab = lastChangeRoute;
  emitter.emit(key, lastChangeRoute);
}

export function listenerRouteChange(callback: (route: MenuRecordRaw) => void, immediate = true) {
  emitter.on(key, callback as any);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  emitter.clear();
}
