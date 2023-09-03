import { WidgetView } from './components/widget';
import { createElement, uniqueId } from '../utils';
import { getEvent } from '../shell';
import {
  IPublicTypeDisposable,
  IPublicTypeWidgetConfigArea,
  ISkeleton,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfma/types';

export class Widget implements IWidget {
  readonly id = uniqueId('widget');

  readonly name: string;

  readonly area: IPublicTypeWidgetConfigArea;

  readonly align?: string;

  private _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  private _body: any;

  get body() {
    const { content, contentProps } = this.config;
    this._body = createElement(content, {
      ...contentProps,
      config: this.config,
      editor: getEvent(this.skeleton.editor),
    });

    return this._body;
  }

  get content() {
    return createElement(WidgetView, {
      widget: this,
      key: this.id,
    });
  }

  constructor(readonly skeleton: ISkeleton, readonly config: WidgetConfig) {
    const { props = {}, name, visible = true, area } = config;
    this.name = name;
    this.area = area;
    this.align = props.align;
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
    this.skeleton.editor.eventBus.on(SkeletonEvents.WIDGET_SHOW, (name: any, widget: any) => {
      listener(name, widget);
    });
    return () => this.skeleton.editor.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  onHide(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.skeleton.editor.eventBus.on(SkeletonEvents.WIDGET_HIDE, (name: any, widget: any) => {
      listener(name, widget);
    });
    return () => this.skeleton.editor.eventBus.off(SkeletonEvents.WIDGET_HIDE, listener);
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
