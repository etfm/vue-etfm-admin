import type {
  IArea,
  IContainer,
  IPublicTypeWidgetBaseConfig,
  ISkeleton,
  WidgetItem,
} from '@etfma/types';
import { observable, define } from '../obx';
import { Logger } from '@etfma/shared';

const logger = new Logger({ bizName: 'skeleton:area' });

export class Area implements IArea {
  public config: IPublicTypeWidgetBaseConfig;

  _visible = true;

  get visible() {
    return this._visible;
  }

  readonly container: IContainer;

  constructor(
    readonly skeleton: ISkeleton,
    readonly name: string,
    handle: (item: IPublicTypeWidgetBaseConfig) => WidgetItem,
    exclusive?: boolean,
  ) {
    this.makeObservable();

    this._visible = exclusive ?? true;

    this.container = skeleton.createContainer(name, handle, exclusive, () => this.visible);
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

  add(config: IPublicTypeWidgetBaseConfig): WidgetItem {
    this.config = config;
    const item = this.container.get(config.name);

    if (item) {
      logger.warn(`The ${config.name} has already been added to skeleton.`);
      return item;
    }

    return this.container.add(config);
  }

  remove(config: WidgetItem | string): number {
    return this.container.remove(config);
  }

  setVisible(flag: boolean) {
    this._visible = flag;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }
}
