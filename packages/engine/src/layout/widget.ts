import { uniqueId } from '@etfm/shared';
import {
  IPublicTypeDisposable,
  IPublicTypeWidgetConfigArea,
  SkeletonEvents,
  WidgetConfig,
} from '@etfm/types';
import { Skeleton } from './skeleton';

export class Widget {
  readonly id = uniqueId('widget');

  readonly name: string;

  readonly area: IPublicTypeWidgetConfigArea;

  readonly align?: string;

  readonly content: any;

  private _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  constructor(readonly skeleton: Skeleton, readonly config: WidgetConfig) {
    const { props = {}, name, visible = true, area } = config;
    this.name = name;
    this.area = area;
    this.align = props.align;
    this.content = props.content;
    this._visible = visible;

    if (props.onInit) {
      props.onInit.call(this, this);
    }
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  onVisible(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.skeleton.eventBus.on(SkeletonEvents.WIDGET_SHOW, (name: any, widget: any) => {
      listener(name, widget);
    });
    return () => this.skeleton.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  onHide(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.skeleton.eventBus.on(SkeletonEvents.WIDGET_HIDE, (name: any, widget: any) => {
      listener(name, widget);
    });
    return () => this.skeleton.eventBus.off(SkeletonEvents.WIDGET_HIDE, listener);
  }

  setVisible(flag: boolean) {
    if (flag === this._visible) {
      return;
    }
    if (flag) {
      this._visible = true;

      this.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, this.name, this);
    } else {
      this._visible = false;
      this.skeleton.postEvent(SkeletonEvents.WIDGET_HIDE, this.name, this);
    }
  }

  toggle() {
    this.setVisible(!this._visible);
  }
}
