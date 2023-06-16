import { IPublicApiSkeleton } from './api/skeleton';
import { IArea } from './area';
import { IContainer } from './container';
import { IEditor } from './core';
import { IPanel, PanelConfig } from './panel';
import { IWidget } from './widget';
import { IPublicTypeSkeletonConfig } from './widget-base-config';

export enum SkeletonEvents {
  PANEL_DOCK_ACTIVE = 'skeleton.panel-dock.active',
  PANEL_DOCK_UNACTIVE = 'skeleton.panel-dock.unactive',
  PANEL_SHOW = 'skeleton.panel.show',
  PANEL_HIDE = 'skeleton.panel.hide',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
  WIDGET_DISABLE = 'skeleton.widget.disable',
  WIDGET_ENABLE = 'skeleton.widget.enable',
}

export interface ISkeleton
  extends Omit<
    IPublicApiSkeleton,
    | 'showPanel'
    | 'hidePanel'
    | 'showWidget'
    | 'enableWidget'
    | 'hideWidget'
    | 'disableWidget'
    | 'showArea'
    | 'onShowPanel'
    | 'onHidePanel'
    | 'onShowWidget'
    | 'onHideWidget'
    | 'remove'
    | 'hideArea'
    | 'add'
  > {
  editor: IEditor;

  readonly leftArea: IArea;

  readonly topArea: IArea;

  readonly toolbar: IArea;

  readonly leftFixedArea: IArea;

  readonly leftFloatArea: IArea;

  readonly rightArea: IArea;

  readonly mainArea: IArea;

  readonly bottomArea: IArea;

  readonly widgets: IWidget[];

  getPanel(name: string): IPanel | undefined;

  getWidget(name: string): IWidget | undefined;

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive?: boolean,
    checkVisible?: () => boolean,
    defaultSetCurrent?: boolean,
  ): IContainer;

  createPanel(config: PanelConfig): IPanel;

  add(
    config: IPublicTypeSkeletonConfig,
    extraConfig?: Record<string, any>,
  ): IWidget | IPanel | undefined;

  toggleFloatStatus(panel: IPanel): void;
  postEvent(event: SkeletonEvents, ...args: any[]): void;
}
