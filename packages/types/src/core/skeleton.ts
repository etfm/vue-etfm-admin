import { IPublicApiSkeleton } from './api/skeleton';
import { IArea } from './area';
import { IEditor } from './core';
import { IWidget } from './widget';
import { IPublicTypeSkeletonConfig } from './widget-base-config';

export enum SkeletonEvents {
  ADD_WIDGET = 'skeleton.add.widget',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
  WIDGET_DISABLE = 'skeleton.widget.disable',
  WIDGET_ENABLE = 'skeleton.widget.enable',
  AREA_SHOW = 'skeleton.area.show',
  AREA_HIDE = 'skeleton.area.hide',
}

export interface ISkeleton
  extends Omit<
    IPublicApiSkeleton,
    | 'showWidget'
    | 'enableWidget'
    | 'hideWidget'
    | 'disableWidget'
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

  // readonly breadcrumb: IArea;

  // readonly fixed: IArea;
  //
  // readonly float: IArea;

  readonly main: IWidget[];

  readonly footer: IWidget[];

  readonly widgets: IWidget[];

  getWidget(name: string): IWidget | undefined;

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): IWidget | undefined;

  postEvent(event: SkeletonEvents, ...args: any[]): void;
}
