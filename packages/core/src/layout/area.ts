import { observable, define } from '../obx';
import { WidgetContainer } from './widget';
import { Skeleton } from './skeleton';
import { IWidget } from './widget/widget';
import { IWidgetBaseConfig } from '../types/api';

export class Area<C extends IWidgetBaseConfig = any, T extends IWidget = IWidget> {
  private lastCurrent: T | null = null;

  _visible = true;

  get visible() {
    if (this.exclusive) {
      return this.container.current != null;
    }
    return this._visible;
  }

  get current() {
    if (this.exclusive) {
      return this.container.current;
    }
    return null;
  }

  readonly container: WidgetContainer<T, C>;

  constructor(
    readonly skeleton: Skeleton,
    readonly name: string,
    handle: (item: T | C) => T,
    private exclusive?: boolean,
    defaultSetCurrent = false,
  ) {
    this.container = skeleton.createContainer(
      name,
      handle,
      exclusive,
      () => this.visible,
      defaultSetCurrent,
    );

    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      _visible: observable,
      visible: observable.computed,
    });
  }

  isEmpty(): boolean {
    return this.container.items.length < 1;
  }

  add(config: T | C): T {
    const item = this.container.get(config.name);

    if (item) {
      return item;
    }
    return this.container.add(config);
  }

  remove(config: T | string): number {
    return this.container.remove(config);
  }

  setVisible(flag: boolean) {
    if (this.exclusive) {
      const { current } = this.container;
      if (flag && !current) {
        this.container.active(this.lastCurrent || this.container.getAt(0));
      } else if (current) {
        this.lastCurrent = current;
        this.container.unactive(current);
      }
      return;
    }
    this._visible = flag;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }
}
