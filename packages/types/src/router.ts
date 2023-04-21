import type { Component, DefineComponent } from 'vue';
import type { RouteMeta, RouteRecordRaw } from 'vue-router';
import type { Recordable } from './tools';

export interface IRouterContext {
  routes: AppRouteRecordRaw[];
  historyType?: string;
  basename?: string;
  rouls?: string[] | (() => string[]);
  onInitTransformRoute?: Function;
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children' | 'component'> {
  name: string;
  meta: RouteMeta;
  component?: DefineComponent | Component | string;
  children?: AppRouteRecordRaw[];
  props?: Recordable<any>;
  fullPath?: string;
}

export type AppRouteModule = AppRouteRecordRaw;
