import type { Component, DefineComponent } from 'vue';
import type { RouteMeta, RouteRecordRaw, RouterHistory, RouterOptions } from 'vue-router';
import type { Recordable } from './tools';

export type * from 'vue-router';

export interface RouterContext extends Omit<RouterOptions, 'routes' | 'history'> {
  routes?: AppRouteRecordRaw[];
  historyType?: string;
  basename?: string;
  rouls?: string[] | (() => string[]);
  history?: RouterHistory;
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children' | 'component'> {
  name: string;
  meta: RouteMeta;
  component?: DefineComponent | Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable<any>;
  fullPath?: string;
}

export type AppRouteModule = AppRouteRecordRaw;
