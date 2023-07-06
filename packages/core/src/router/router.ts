import { createRouter, type Router, type RouteRecordRaw } from 'vue-router';
import { createHistory } from './history';
import { AppRouteRecordRaw, IRouterContext } from '@etfma/types';
import { engineConfig } from '../config';
import { filter, lodash } from '@etfma/shared';
import { flatMultiLevelRoutes, routeRemoveFilter } from './utils';
import { App } from 'vue';

const ROUTER_OPTIONS = {
  historyType: 'hash',
  basename: '/',
  routes: [],
};

export class GlobalRouter {
  private _router: Router;
  private _app: App;
  private _opts: IRouterContext;

  constructor(app: App) {
    this._opts = ROUTER_OPTIONS;
    this._app = app;

    this.init();

    engineConfig.onGot('router', (args: IRouterContext) => {
      this._opts = lodash.merge(this._opts, args);

      this.init();
    });
  }

  get router() {
    return this._router;
  }

  init() {
    const routeList = this.getRouters(this._opts.routes);

    const history = createHistory({
      type: this._opts.historyType,
      basename: this._opts.basename,
    });

    this._router = createRouter({
      ...this._opts,
      // 创建一个 hash 历史记录。
      history: history,
      // 应该添加到路由的初始路由列表。
      routes: routeList as unknown as RouteRecordRaw[],
      // 是否应该禁止尾部斜杠。默认为假
      strict: true,
    });

    this._app.use(this._router);
  }

  getRouters(routes: AppRouteRecordRaw[] | AppRouteRecordRaw) {
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
