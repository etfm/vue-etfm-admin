import { define, observable } from '../../obx';
import { lodash } from '@etfma/shared';
import { WidgetConfig } from '../types';
import { Skeleton } from '../skeleton';
import { WidgetView } from '../components/widget';
import { IWidgetBaseConfig } from '../../types/api';
import { createElement } from '../../utils';
import { getEvent } from '../../shell';

export interface IWidget {
  readonly name: string;
  readonly content: any;
  readonly align?: string;
  readonly isWidget: true;
  readonly visible: boolean;
  readonly disabled?: boolean;
  readonly body: any;
  readonly skeleton: Skeleton;
  readonly config: IWidgetBaseConfig;

  getName(): string;
  getContent(): any;
  show(): void;
  hide(): void;
  toggle(): void;
  enable?(): void;
  disable?(): void;
}

export class Widget implements IWidget {
  readonly isWidget = true;

  readonly id = lodash.uniqueId('widget');

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

  constructor(readonly skeleton: Skeleton, readonly config: WidgetConfig) {
    const { props = {}, name } = config;
    this.name = name;
    this.align = props.align;
    if (props.onInit) {
      props.onInit.call(this, this);
    }

    this.makeObservable();

    console.log('Widget:constructor:', this);
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

  setVisible(flag: boolean) {
    if (flag === this._visible) {
      return;
    }
    if (flag) {
      this._visible = true;
    } else if (this.inited) {
      this._visible = false;
    }
  }

  toggle() {
    this.setVisible(!this._visible);
  }

  private setDisabled(flag: boolean) {
    if (this._disabled === flag) return;
    this._disabled = flag;
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
