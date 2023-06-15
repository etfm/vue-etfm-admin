import { WidgetItem } from './container';
import { PanelConfig } from './panel';
import { WidgetConfig } from './widget';

export interface IArea {
  visible: boolean;
  isEmpty(): boolean;
  add(config: AreaWidgetConfig): WidgetItem;
  remove(config: WidgetItem | string): number;
  setVisible(flag: boolean): void;
  hide(): void;
  show(): void;
  [x: string]: any;
}

export type AreaWidgetConfig = WidgetConfig | PanelConfig;
