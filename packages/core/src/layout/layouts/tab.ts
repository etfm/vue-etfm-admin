import { WidgetView } from './components/widget';
import { createElement, uniqueId } from '../utils';

import { getEvent } from '../shell';
import { ISkeleton, IWidget, SkeletonEvents, WidgetConfig } from '@etfma/types';

export enum TabWidgetEvents {
  WIDGET_SHOW = 'tab.widget.show',
  WIDGET_HIDE = 'tab.widget.hide',
  WIDGET_DISABLE = 'tab.widget.disable',
  WIDGET_ENABLE = 'tab.widget.enable',
}

export class TabWidget implements IWidget {
  readonly isWidget = true;

  readonly id = uniqueId('widget');

  readonly name: string;

  readonly align?: string;

  _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  _disabled = false;

  private _body: any;

  get body() {
    const { content, contentProps } = this.config;
    this._body = createElement(content, {
      ...contentProps,
      config: this.config,
      event: getEvent(this.skeleton.editor),
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
    const { props = {}, name, visible = true, disabled = false } = config;
    this.name = name;
    this.align = props.align;
    this._visible = visible;
    this._disabled = disabled;

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
    } else {
      this._visible = false;
      this.skeleton.postEvent(SkeletonEvents.WIDGET_HIDE, this.name, this);
    }
  }

  toggle() {
    this.setVisible(!this._visible);
  }
}

export function isWidget(obj: any): obj is IWidget {
  return obj && obj.isWidget;
}
