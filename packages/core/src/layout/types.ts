import { VNode } from 'vue';
import { IWidget } from './widget/widget';
import { IWidgetBaseConfig, IWidgetConfigArea } from '../types/api';

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

export interface DockProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export interface IDockBaseConfig extends IWidgetBaseConfig {
  props?: DockProps & {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
  };
}

export interface DockConfig extends IDockBaseConfig {
  type: 'Dock';
  content?: string | VNode;
}

export function isDockConfig(obj: any): obj is DockConfig {
  return obj && /Dock$/.test(obj.type);
}

// 窗格扩展
export interface PanelConfig extends IWidgetBaseConfig {
  type: 'Panel';
  content?: string | VNode | PanelConfig[]; // as children
  props?: PanelProps;
}

export function isPanelConfig(obj: any): obj is PanelConfig {
  return obj && obj.type === 'Panel';
}

export type HelpTipConfig = string | { url?: string; content?: string | VNode };

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
}

export interface PanelDockConfig extends IDockBaseConfig {
  type: 'PanelDock';
  panelName?: string;
  panelProps?: PanelProps & {
    area?: IWidgetConfigArea;
  };
  content?: string | VNode | PanelConfig[]; // content for pane
}

export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
  return obj && obj.type === 'PanelDock';
}
