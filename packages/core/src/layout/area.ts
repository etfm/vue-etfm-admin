import {
  IArea,
  IPublicTypeWidgetBaseConfig,
  ISkeleton,
  IWidget,
  SkeletonEvents,
} from '@etfma/types';
import { observable, define } from '../obx';
import { Logger } from '@etfma/shared';
import { hasOwnProperty } from '../utils';
import { Widget } from './widget';

const logger = new Logger({ bizName: 'skeleton:area' });

export class Area implements IArea {
  private maps: { [name: string]: IWidget } = {};

  public items: IWidget[] = [];

  public config: IPublicTypeWidgetBaseConfig;

  _visible = true;

  get visible() {
    return this._visible;
  }

  // readonly container: IContainer;

  constructor(
    readonly skeleton: ISkeleton,
    readonly name: string,
    private handle: (item: IPublicTypeWidgetBaseConfig) => IWidget,
    exclusive?: boolean,
  ) {
    this.makeObservable();
    this._visible = exclusive ?? true;
  }

  makeObservable() {
    define(this, {
      _visible: observable.ref,
      visible: observable.computed,
      items: observable.shallow,
    });
  }

  isEmpty(): boolean {
    return this.items.length < 1;
  }

  add(config: IPublicTypeWidgetBaseConfig): IWidget {
    this.config = config;
    const item = this.get(config.name);

    if (item) {
      logger.warn(`The ${config.name} has already been added to skeleton.`);
      return item;
    }

    const widget = this.handle(config);
    const origin = this.get(widget.name);
    if (origin === widget) {
      return origin;
    }
    const i = origin ? this.items.indexOf(origin) : -1;
    if (i > -1) {
      this.items[i] = widget;
    } else {
      this.items.push(widget);
    }
    this.maps[widget.name] = widget;

    return widget;
  }

  get(name: string): IWidget | null {
    return this.maps[name] || null;
  }

  getAt(index: number): IWidget | null {
    return this.items[index] || null;
  }

  has(name: string): boolean {
    return hasOwnProperty(this.maps, name);
  }

  indexOf(item: IWidget): number {
    return this.items.indexOf(item);
  }

  remove(config: Widget | string): number {
    const thing = typeof config === 'string' ? this.get(config) : config;
    if (!thing) {
      return -1;
    }
    const i = this.items.indexOf(thing);
    if (i > -1) {
      this.items.splice(i, 1);
    }
    delete this.maps[thing.name];

    return i;
  }

  setVisible(flag: boolean) {
    this._visible = flag;
    if (flag) {
      this.skeleton.postEvent(SkeletonEvents.AREA_SHOW, this.name, this);
    } else {
      this.skeleton.postEvent(SkeletonEvents.AREA_HIDE, this.name, this);
    }
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }
}
