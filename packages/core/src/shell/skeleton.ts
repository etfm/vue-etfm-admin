import {
  IPublicApiSkeleton,
  IPublicModelSkeletonItem,
  IPublicTypeDisposable,
  IPublicTypeSkeletonConfig,
  IPublicTypeWidgetConfigArea,
  IPublicTypeWidgetConfigAreaVisible,
  ISkeleton,
  SkeletonEvents,
} from '@etfma/types';
import { SkeletonItem } from './skeleton-item';
import { configSymbol, skeletonSymbol } from './symbols';
import { VNode, h } from 'vue';
import { Workbench as InnerWorkbench } from '../layout/layouts';
import { EngineConfig } from '../config';

export class Skeleton implements IPublicApiSkeleton {
  private readonly [skeletonSymbol]: ISkeleton;
  private readonly [configSymbol]: EngineConfig;

  constructor(skeleton: ISkeleton, config: EngineConfig) {
    this[skeletonSymbol] = skeleton;
    this[configSymbol] = config;
  }

  get Workbench(): VNode {
    return h(InnerWorkbench, {
      skeleton: this[skeletonSymbol],
    });
  }

  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(
    config: IPublicTypeSkeletonConfig,
    extraConfig?: Record<string, any>,
  ): IPublicModelSkeletonItem | undefined {
    const item = this[skeletonSymbol].add(config, extraConfig);
    if (item) {
      return new SkeletonItem(item);
    }
  }

  /**
   * 移除一个面板实例
   * @param config
   * @returns
   */
  remove(config: IPublicTypeSkeletonConfig): void {
    const { area, name } = config;
    const skeleton = this[skeletonSymbol];
    if (!normalizeArea(area)) {
      return;
    }
    skeleton.remove(area, name);
  }

  getAreaItems(areaName: IPublicTypeWidgetConfigArea): IPublicModelSkeletonItem[] {
    return this[skeletonSymbol][normalizeArea(areaName)]?.map((d) => new SkeletonItem(d));
  }

  /**
   * 显示 widget
   * @param name
   */
  showWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.show();
  }

  /**
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.hide();
  }

  /**
   * show area
   * @param areaName name of area
   */
  showArea(areaName: IPublicTypeWidgetConfigAreaVisible) {
    this[configSymbol].set(normalizeAreaKey(areaName), true);
  }

  /**
   * hide area
   * @param areaName name of area
   */
  hideArea(areaName: IPublicTypeWidgetConfigAreaVisible) {
    this[configSymbol].set(normalizeAreaKey(areaName), false);
  }

  /**
   * 监听 area 显示事件
   * @param listener
   * @returns
   */
  onShowArea(areaName: IPublicTypeWidgetConfigAreaVisible, listener: (...args: any[]) => void) {
    this[configSymbol].onGot(normalizeAreaKey(areaName), (args) => {
      !!args && listener(args);
    });
  }

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideArea(areaName: IPublicTypeWidgetConfigAreaVisible, listener: (...args: any[]) => void) {
    this[configSymbol].onGot(normalizeAreaKey(areaName), (args) => {
      !!!args && listener(args);
    });
  }

  /**
   * 监听 widget 显示事件
   * @param listener
   * @returns
   */
  onShowWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.WIDGET_SHOW, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...rest } = panel;
      listener(name, rest);
    });
    return () => editor.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.WIDGET_HIDE, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...rest } = panel;
      listener(name, rest);
    });
    return () => editor.eventBus.off(SkeletonEvents.WIDGET_HIDE, listener);
  }
}

function normalizeArea(area: IPublicTypeWidgetConfigArea | string): IPublicTypeWidgetConfigArea {
  switch (area) {
    case 'aside':
      return 'aside';
    case 'header':
      return 'header';
    case 'toolbar':
      return 'toolbar';
    case 'main':
      return 'main';
    case 'footer':
      return 'footer';
    case 'extra':
      return 'extra';
    default:
      throw new Error(`${area} not supported`);
  }
}
function normalizeAreaKey(area: IPublicTypeWidgetConfigAreaVisible) {
  switch (area) {
    case 'aside':
      return 'layout.sideVisible';
    case 'header':
      return 'layout.headerVisible';
    case 'toolbar':
      return 'layout.tabVisible';
    case 'footer':
      return 'layout.footerVisible';
    case 'extra':
      return 'layout.mixedExtraVisible';
    default:
      throw new Error(`${area} not supported`);
  }
}
