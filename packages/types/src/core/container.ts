import { IPanel } from './panel';
import { IWidget } from './widget';
import { IPublicTypeWidgetBaseConfig } from './widget-base-config';

export interface Activeable {
  setActive(flag: boolean): void;
}

export interface IContainer {
  [key: string]: any;
  items: WidgetItem[];
  current: (WidgetItem & Activeable) | null;
  visible: boolean;
  active: (nameOrItem?: WidgetItem | string | null) => void;
  unactive: (nameOrItem?: WidgetItem | string | null) => void;
  unactiveAll: () => void;
  add: (item: IPublicTypeWidgetBaseConfig) => WidgetItem;
  get: (name: string) => WidgetItem | null;
  getAt: (index: number) => WidgetItem | null;
  has: (name: string) => boolean;
  indexOf: (item: WidgetItem) => number;
  remove: (item: string | WidgetItem) => number;
}

export type WidgetItem = IPanel | IWidget;
