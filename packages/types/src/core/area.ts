import { IWidget } from './widget';
import { IPublicTypeWidgetBaseConfig } from './widget-base-config';

export interface IArea {
  visible: boolean;
  isEmpty(): boolean;
  add(config: IPublicTypeWidgetBaseConfig): IWidget;
  items: IWidget[];
  add: (item: IPublicTypeWidgetBaseConfig) => IWidget;
  get: (name: string) => IWidget | null;
  getAt: (index: number) => IWidget | null;
  has: (name: string) => boolean;
  indexOf: (item: IWidget) => number;
  remove(config: IWidget | string): number;
  setVisible(flag: boolean): void;
  hide(): void;
  show(): void;
}
