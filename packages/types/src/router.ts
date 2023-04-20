import { RouteMeta, RouteRecordRaw } from 'vue-router';

export interface IRouterContext {
  routes: AppRouteRecordRaw[];
  historyType?: string;
  basename?: string;
  rouls?: string[] | (() => string[]);
  onInitTransformRoute?: Function;
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
}

export type AppRouteModule = AppRouteRecordRaw;
