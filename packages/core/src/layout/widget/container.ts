import { define, observable } from '../../obx';
import { hasOwnProperty } from '../../utils';
import type { IContainer, IPublicTypeWidgetBaseConfig, WidgetItem } from '@etfma/types';

export class WidgetContainer implements IContainer {
  items: WidgetItem[] = [];

  private maps: { [name: string]: WidgetItem } = {};

  get visible() {
    return this.checkVisible();
  }

  constructor(
    readonly name: string,
    private handle: (item: IPublicTypeWidgetBaseConfig) => WidgetItem,
    private exclusive: boolean = false,
    private checkVisible: () => boolean = () => true,
  ) {
    console.log(name, '////////////////////');

    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      items: observable.shallow,
      visible: observable.computed,
    });
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

    return i;
  }
}
