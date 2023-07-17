import { define, observable } from '../obx';
import { WidgetView } from './components/widget';
import { createElement, uniqueId } from '../utils';
import { getEvent } from '../shell';
import { ISkeleton, IWidget, SkeletonEvents, WidgetConfig } from '@etfma/types';

export class Widget implements IWidget {
  readonly isWidget = true;

  readonly id = uniqueId('widget');

  readonly name: string;

  readonly align?: string;

  _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  inited = false;

  _disabled = false;

  private _body: any;

  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
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
    this.makeObservable();

    const { props = {}, name, visible = true, disabled = false } = config;
    this.name = name;
    this.align = props.align;
    this._visible = visible;
    this._disabled = disabled;

    if (props.onInit) {
      props.onInit.call(this, this);
    }
  }

  makeObservable() {
    define(this, {
      _visible: observable.ref,
      inited: observable.ref,
      _disabled: observable.ref,
    });
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

  isFloatArea(): boolean {
    return this.config?.area === 'float';
  }

  isFixedArea(): boolean {
    return this.config?.area === 'fixed';
  }

  setVisible(flag: boolean) {
    if (flag === this._visible) {
      return;
    }
    if (flag) {
      this._visible = true;
      this.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, this.name, this);
    } else if (this.inited) {
      this._visible = false;
      this.skeleton.postEvent(SkeletonEvents.WIDGET_HIDE, this.name, this);
    }
  }

  toggle() {
    this.setVisible(!this._visible);
  }

  setDisabled(flag: boolean) {
    if (this._disabled === flag) return;
    this._disabled = flag;
    if (this._disabled) {
      this.skeleton.postEvent(SkeletonEvents.WIDGET_DISABLE, this.name, this);
    } else {
      this.skeleton.postEvent(SkeletonEvents.WIDGET_ENABLE, this.name, this);
    }
  }

  disable() {
    this.setDisabled(true);
  }

  enable() {
    this.setDisabled(false);
  }

  get disabled(): boolean {
    return this._disabled;
  }
}

export function isWidget(obj: any): obj is IWidget {
  return obj && obj.isWidget;
}
