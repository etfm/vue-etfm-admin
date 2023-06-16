import { WidgetItem } from './container';
import { IPublicTypeWidgetBaseConfig } from './widget-base-config';

export interface IArea {
  visible: boolean;
  isEmpty(): boolean;
  add(config: IPublicTypeWidgetBaseConfig): WidgetItem;
  remove(config: WidgetItem | string): number;
  setVisible(flag: boolean): void;
  hide(): void;
  show(): void;
  [x: string]: any;
}
