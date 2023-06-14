import type { VNode } from 'vue';
import { IPublicTypeWidgetBaseConfig } from './widget-base-config';
import { IWidget } from './widget';

export interface PanelConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Panel';
  content?: string | VNode | PanelConfig[]; // as children
  props?: PanelProps;
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

export interface IPanel extends IWidget {}
