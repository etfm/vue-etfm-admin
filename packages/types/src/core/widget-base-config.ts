import { IPublicTypeWidgetConfigArea } from './widget-config-area';

export interface IPublicTypeWidgetBaseConfig {
  name: string;
  area: IPublicTypeWidgetConfigArea;
  props?: Record<string, any>;
  content?: any;
  contentProps?: Record<string, any>;
  [extra: string]: any;
}

export type IPublicTypeSkeletonConfig = IPublicTypeWidgetBaseConfig;
