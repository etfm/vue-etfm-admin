import { define, observable } from '../../obx';
import { isPanel } from './panel';
import { hasOwnProperty } from '../../utils';
import type { Activeable, IContainer, IPublicTypeWidgetBaseConfig, WidgetItem } from '@etfma/types';

function isActiveable(obj: any): obj is Activeable {
  return obj && obj.setActive;
}

export class WidgetContainer implements IContainer {
  items: WidgetItem[] = [];

  private maps: { [name: string]: WidgetItem } = {};

  _current: (WidgetItem & Activeable) | null = null;

  get current() {
    return this._current;
  }

  get visible() {
    return this.checkVisible();
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    readonly name: string,
    private handle: (item: IPublicTypeWidgetBaseConfig) => WidgetItem,
    private exclusive: boolean = false,
    private checkVisible: () => boolean = () => true,
    private defaultSetCurrent: boolean = false,
  ) {
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      items: observable.shallow,
      _current: observable.ref,
      visible: observable.computed,
    });
  }

  active(nameOrItem?: WidgetItem | string | null) {
    let item: any = nameOrItem;
    if (nameOrItem && typeof nameOrItem === 'string') {
      item = this.get(nameOrItem);
    }

    if (!isActiveable(item)) {
      item = null;
    }

    if (this.exclusive) {
      if (this._current === item) {
        return;
      }
      if (this._current) {
        this._current.setActive(false);
      }
      this._current = item;
    }

    if (item) {
      item.setActive(true);
    }
  }

  unactive(nameOrItem?: WidgetItem | string | null) {
    let item: any = nameOrItem;
    if (nameOrItem && typeof nameOrItem === 'string') {
      item = this.get(nameOrItem);
    }
    if (!isActiveable(item)) {
      item = null;
    }
    if (this._current === item) {
      this._current = null;
    }
    if (item) {
      item.setActive(false);
    }
  }

  unactiveAll() {
    Object.keys(this.maps).forEach((name) => this.unactive(name));
  }

  add(item: IPublicTypeWidgetBaseConfig): WidgetItem {
    const widgetItem = this.handle(item);

    const origin = this.get(widgetItem.name);

    if (origin === widgetItem) {
      return origin;
    }
    const i = origin ? this.items.indexOf(origin) : -1;
    if (i > -1) {
      this.items[i] = widgetItem;
    } else {
      this.items.push(widgetItem);
    }
    this.maps[widgetItem.name] = widgetItem;
    if (isPanel(widgetItem)) {
      widgetItem.setParent(this);
    }
    if (this.defaultSetCurrent) {
      const shouldHiddenWhenInit = widgetItem.config?.props?.hiddenWhenInit;

      if (!this._current && !shouldHiddenWhenInit) {
        this.active(widgetItem);
      }
    }

    return widgetItem;
  }

  get(name: string): WidgetItem | null {
    return this.maps[name] || null;
  }

  getAt(index: number): WidgetItem | null {
    return this.items[index] || null;
  }

  has(name: string): boolean {
    return hasOwnProperty(this.maps, name);
  }

  indexOf(item: WidgetItem): number {
    return this.items.indexOf(item);
  }

  /**
   * return indexOf the deletion
   */
  remove(item: string | WidgetItem): number {
    const thing = typeof item === 'string' ? this.get(item) : item;
    if (!thing) {
      return -1;
    }
    const i = this.items.indexOf(thing);
    if (i > -1) {
      this.items.splice(i, 1);
    }
    delete this.maps[thing.name];
    if (thing === this.current) {
      this._current = null;
    }
    return i;
  }
}
