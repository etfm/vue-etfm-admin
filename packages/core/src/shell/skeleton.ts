import {
  IPublicApiSkeleton,
  IPublicModelSkeletonItem,
  IPublicTypeDisposable,
  IPublicTypeSkeletonConfig,
  IPublicTypeWidgetConfigArea,
  ISkeleton,
  SkeletonEvents,
} from '@etfma/types';
import { SkeletonItem } from './skeleton-item';
import { skeletonSymbol } from './symbols';

export class Skeleton implements IPublicApiSkeleton {
  private readonly [skeletonSymbol]: ISkeleton;

  constructor(skeleton: ISkeleton) {
    this[skeletonSymbol] = skeleton;
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
  remove(config: IPublicTypeSkeletonConfig): number | undefined {
    const { area, name } = config;
    const skeleton = this[skeletonSymbol];
    if (!normalizeArea(area)) {
      return;
    }
    skeleton[normalizeArea(area)]?.remove(name);
  }

  getAreaItems(areaName: IPublicTypeWidgetConfigArea): IPublicModelSkeletonItem[] {
    return this[skeletonSymbol][normalizeArea(areaName)].items?.map((d) => new SkeletonItem(d));
  }

  /**
   * 显示 widget
   * @param name
   */
  showWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.show();
  }

  /**
   * enable widget
   * @param name
   */
  enableWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.enable?.();
  }

  /**
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.hide();
  }

  /**
   * disable widget，不可点击
   * @param name
   */
  disableWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.disable?.();
  }

  /**
   * show area
   * @param areaName name of area
   */
  showArea(areaName: string) {
    (this[skeletonSymbol] as any)[normalizeArea(areaName)]?.show();
  }

  /**
   * hide area
   * @param areaName name of area
   */
  hideArea(areaName: string) {
    (this[skeletonSymbol] as any)[normalizeArea(areaName)]?.hide();
  }

  /**
   * 监听 area 显示事件
   * @param listener
   * @returns
   */
  onShowArea(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.AREA_SHOW, (name: any, area: any) => {
      const { skeleton, ...rest } = area;
      listener(name, rest);
    });
    return () => editor.eventBus.off(SkeletonEvents.AREA_SHOW, listener);
  }

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideArea(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.AREA_HIDE, (name: any, area: any) => {
      const { skeleton, ...rest } = area;
      listener(name, rest);
    });
    return () => editor.eventBus.off(SkeletonEvents.AREA_HIDE, listener);
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
    case 'breadcrumb':
      return 'breadcrumb';
    case 'main':
      return 'main';
    case 'footer':
      return 'footer';
    case 'fixed':
      return 'fixed';
    case 'float':
      return 'float';
    default:
      throw new Error(`${area} not supported`);
  }
}
