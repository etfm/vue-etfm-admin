import { VNode } from 'vue';
import { IPublicTypeWidgetBaseConfig } from '../widget-base-config';
import { IPublicTypeWidgetConfigArea } from '../widget-config-area';

export interface IPublicApiSkeleton {
  /**
   * 页面实例
   */
  Workbench: VNode;
  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>): any;

  /**
   * 移除一个面板实例
   * @param config
   * @returns
   */
  remove(config: IPublicTypeWidgetBaseConfig): void;

  /**
   * 显示 widget
   * @param name
   */
  showWidget(name: string): void;

  /**
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string): void;

  /**
   * show area
   * @param areaName name of area
   */
  showArea(areaName: string): void;

  /**
   * hide area
   * @param areaName name of area
   */
  hideArea(areaName: string): void;

  /**
   * 监听 area 显示事件
   * @param listener
   * @returns
   */
  onShowArea(
    areaName: Omit<IPublicTypeWidgetConfigArea, 'main'>,
    listener: (...args: unknown[]) => void,
  ): void;

  /**
   * 监听 area 隐藏事件
   * @param listener
   * @returns
   */
  onHideArea(
    areaName: Omit<IPublicTypeWidgetConfigArea, 'main'>,
    listener: (...args: unknown[]) => void,
  ): void;

  /**
   * 监听 widget 显示事件
   * @param listener
   * @returns
   */
  onShowWidget(listener: (...args: unknown[]) => void): () => void;

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideWidget(listener: (...args: unknown[]) => void): () => void;
}
