import { VNode } from 'vue';
import { IWidget } from './widget/widget';
import { IWidgetBaseConfig } from '../types/api';
import { IPublicTypeWidgetBaseConfig } from '../types/widget-base-config';

export interface WidgetConfig extends IWidgetBaseConfig {
  type: 'Widget';
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
  };
  content?: any; // children
}

export function isWidgetConfig(obj: any): obj is WidgetConfig {
  return obj && obj.type === 'Widget';
}

// 窗格扩展
export interface PanelConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Panel';
  content?: string | VNode | PanelConfig[]; // as children
  props?: PanelProps;
}

export function isPanelConfig(obj: any): obj is PanelConfig {
  return obj && obj.type === 'Panel';
}

export interface PanelProps {
  width?: number; // panel.props
  height?: number; // panel.props
  maxWidth?: number; // panel.props
  maxHeight?: number; // panel.props
  condition?: (widget: IWidget) => any;
  onInit?: (widget: IWidget) => any;
  onDestroy?: () => any;
  shortcut?: string; // 只有在特定位置，可触发 toggle show
  enableDrag?: boolean; // 是否开启通过 drag 调整 宽度
  keepVisibleWhileDragging?: boolean; // 是否在该 panel 范围内拖拽时保持 visible 状态
  canSetFixed?: boolean;
}
