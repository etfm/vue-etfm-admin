import type { IArea, IPublicTypeWidgetBaseConfig, ISkeleton, IWidget } from '@etfma/types';
import { observable, define } from '../obx';
import { WidgetContainer } from './widget';
import { Logger } from '@etfma/shared';

const logger = new Logger({ bizName: 'skeleton:area' });

export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget>
  implements IArea<C, T>
{
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
  private lastCurrent: T | null = null;

  constructor(
    readonly skeleton: ISkeleton,
    readonly name: string,
    handle: (item: T | C) => T,
    private exclusive?: boolean,
    defaultSetCurrent = false,
  ) {
    this.makeObservable();

    this.container = skeleton.createContainer(
      name,
      handle,
      exclusive,
      () => this.visible,
      defaultSetCurrent,
    );
  }

  makeObservable() {
    define(this, {
      _visible: observable.ref,
      visible: observable.computed,
    });
  }

  isEmpty(): boolean {
    return this.container.items.length < 1;
  }

  add(config: T | C): T {
    const item = this.container.get(config.name);

    if (item) {
      logger.warn(`The ${config.name} has already been added to skeleton.`);
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
