import { IWidget } from './widget';
import { IPublicTypeWidgetConfigArea } from './widget-config-area';

export interface IPublicTypeWidgetBaseConfig {
  name: string;
  area: IPublicTypeWidgetConfigArea;
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    [x: string]: any;
  };
  visible?: boolean;
  content?: any;
  contentProps?: Record<string, any>;
  [extra: string]: any;
}

export type IPublicTypeSkeletonConfig = IPublicTypeWidgetBaseConfig;
