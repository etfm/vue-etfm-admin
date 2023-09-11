import {
  IPublicModelSkeletonItem,
  IPublicTypeDisposable,
  IPublicTypeSkeletonConfig,
  SkeletonEvents,
} from '@etfm/types';
import { SkeletonItem } from './skeleton-item';
import { skeletonSymbol } from './symbols';
import { Skeleton as InnerSkeleton } from '../layout';

export class Skeleton {
  private readonly [skeletonSymbol]: InnerSkeleton;

  constructor(skeleton: InnerSkeleton) {
    this[skeletonSymbol] = skeleton;
  }

  /**
   * 增加一个widget
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
   * 移除一个widget
   * @param config
   * @returns
   */
  remove(config: IPublicTypeSkeletonConfig): void {
    const { name } = config;
    const skeleton = this[skeletonSymbol];
    skeleton.remove(name);
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
   * 监听 widget 显示事件
   * @param listener
   * @returns
   */
  onShowWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this[skeletonSymbol].eventBus.on(SkeletonEvents.WIDGET_SHOW, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...rest } = panel;
      listener(name, rest);
    });
    return () => this[skeletonSymbol].eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this[skeletonSymbol].eventBus.on(SkeletonEvents.WIDGET_HIDE, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...rest } = panel;
      listener(name, rest);
    });
    return () => this[skeletonSymbol].eventBus.off(SkeletonEvents.WIDGET_HIDE, listener);
  }
}
