import { IPublicTypeWidgetConfigArea } from './widget-config-area';

export interface IPublicTypeWidgetBaseConfig {
  type: string;
  name: string;

  /**
   * 停靠位置：
   * - 当 type 为 'Panel' 时自动为 'leftFloatArea'；
   * - 当 type 为 'Widget' 时自动为 'mainArea'；
   * - 其他时候自动为 'leftArea'；
   */
  area?: IPublicTypeWidgetConfigArea;
  props?: Record<string, any>;
  content?: any;
  contentProps?: Record<string, any>;
  [extra: string]: any;
}

export type IPublicTypeSkeletonConfig = IPublicTypeWidgetBaseConfig;
