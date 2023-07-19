import { createRouter, type Router, type RouteRecordRaw } from 'vue-router';
import { createHistory } from './history';
import { AppRouteRecordRaw, IEditor, IGlobalRouter, RouterContext } from '@etfma/types';
import { engineConfig } from '../config';
import { filter, lodash } from '@etfma/shared';
import { flatMultiLevelRoutes, routeRemoveFilter } from './utils';
import { DEFAULT_REDIRECT, ROUTER_OPTIONS } from './constants';

export class GlobalRouter implements IGlobalRouter {
  private _router: Router;
  private _opts: RouterContext;

  constructor(editor: IEditor) {
    this._opts = ROUTER_OPTIONS;

    engineConfig.onceGot('router').then((args: RouterContext) => {
      this._opts = lodash.merge(this._opts, args);

      this.init();
    });

    editor.onGot('routes', (args: AppRouteRecordRaw[] | AppRouteRecordRaw) => {
      const routeList = this.getRouters(args);

      routeList.forEach((route) => {
        this._router.addRoute(route as unknown as RouteRecordRaw);
      });
    });
  }

  get router() {
    return this._router;
  }

  init() {
    const routeList = this.getRouters(this._opts.routes);

    routeList.push(DEFAULT_REDIRECT);

    const history = createHistory({
      type: this._opts.historyType,
      basename: this._opts.basename,
    });

    this._router = createRouter({
      ...this._opts,
      history: history,
      routes: routeList as unknown as RouteRecordRaw[],
      strict: true,
    });
  }

  getRouters(routes?: AppRouteRecordRaw[] | AppRouteRecordRaw) {
    const rouls =
      this._opts.rouls && lodash.isFunction(this._opts.rouls)
        ? this._opts.rouls()
        : this._opts.rouls;

    if (routes && !lodash.isEmpty(routes)) {
      routes = lodash.isArray(routes) ? routes : [routes];
      // 忽略路由
      const filterRoutes = filter(routes, (route) => routeRemoveFilter(route, rouls as string[]));
      // 路由打平到二级路由
      const patchRoutes = flatMultiLevelRoutes(filterRoutes);

      return patchRoutes;
    }

    return [];
  }
}
