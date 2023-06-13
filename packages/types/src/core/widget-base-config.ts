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

export interface IPublicTypePanelDockPanelProps {
  [key: string]: any;

  /** 是否隐藏面板顶部条 */
  hideTitleBar?: boolean;

  width?: number;

  height?: number;

  maxWidth?: number;

  maxHeight?: number;

  area?: IPublicTypeWidgetConfigArea;
}

export type IPublicTypeSkeletonConfig = IPublicTypeWidgetBaseConfig;
