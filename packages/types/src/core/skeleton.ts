import { IPublicApiSkeleton } from './api/skeleton';
import { IArea } from './area';
import { IEditor } from './core';
import { IPanel } from './panel';
import { IWidget } from './widget';
import { IPublicTypeSkeletonConfig } from './widget-base-config';

export enum SkeletonEvents {
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

  readonly leftArea: IArea;

  readonly topArea: IArea;

  readonly toolbar: IArea;

  readonly fixedArea: IArea;

  readonly floatArea: IArea;

  readonly rightArea: IArea;

  readonly mainArea: IArea;

  readonly bottomArea: IArea;

  readonly widgets: IWidget[];

  getWidget(name: string): IWidget | undefined;

  add(
    config: IPublicTypeSkeletonConfig,
    extraConfig?: Record<string, any>,
  ): IWidget | IPanel | undefined;

  postEvent(event: SkeletonEvents, ...args: any[]): void;
}
