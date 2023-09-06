import { IPublicApiSkeleton } from './api/skeleton';
import { IEditor } from './core';
import { IPublicTypeDisposable } from './disposable';
import { IWidget } from './widget';
import { IPublicTypeSkeletonConfig } from './widget-base-config';
import { IPublicTypeWidgetConfigArea } from './widget-config-area';

export enum SkeletonEvents {
  ADD_WIDGET = 'skeleton.add.widget',
  REMOVE_WIDGET = 'skeleton.remove.widget',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
  AREA_SHOW = 'skeleton.area.show',
  AREA_HIDE = 'skeleton.area.hide',
}

export interface ISkeleton
  extends Omit<
    IPublicApiSkeleton,
    | 'Workbench'
    | 'showWidget'
    | 'hideWidget'
    | 'showArea'
    | 'hideArea'
    | 'onShowArea'
    | 'onHideArea'
    | 'onShowWidget'
    | 'onHideWidget'
    | 'remove'
    | 'add'
  > {
  editor: IEditor;

  readonly aside: IWidget[];

  readonly header: IWidget[];

  readonly toolbar: IWidget[];

  readonly extra: IWidget[];

  readonly main: IWidget[];

  readonly footer: IWidget[];

  readonly widgets: IWidget[];

  getWidget(name: string): IWidget | undefined;

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): IWidget | undefined;

  postEvent(event: SkeletonEvents, ...args: any[]): void;

  remove(area: IPublicTypeWidgetConfigArea, name: string): void;

  onWidget(listener: (...args: any[]) => void): IPublicTypeDisposable;
}
