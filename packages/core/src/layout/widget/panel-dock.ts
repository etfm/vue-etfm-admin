import { observable, define } from '../../obx';
import { createElement, uniqueId } from '../../utils';
import { ISkeleton } from '../skeleton';
import { PanelDockConfig } from '../types';
import { Panel } from './panel';
import { PanelDockView } from '../components/widget';
import { IWidget } from './widget';

export class PanelDock implements IWidget {
  readonly isWidget = true;

  readonly isPanelDock = true;

  readonly id: string;

  readonly name: string;

  readonly align?: 'left' | 'right' | 'bottom' | 'center' | 'top' | undefined;

  private inited = false;

  private _body: any;

  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
    const { props, content } = this.config;
    this._body = createElement(content, {
      ...props,
      dock: this,
    });

    return this._body;
  }

  get content() {
    const area = this.config?.area;
    return createElement(PanelDockView, {
      panelDock: this,
      key: this.id,
      area,
      config: this.config,
    });
  }

  _visible = true;

  get visible() {
    return this._visible;
  }

  get actived(): boolean {
    return this.panel?.visible || false;
  }

  readonly panelName: string;

  private _panel?: Panel;

  _disabled = false;

  get panel() {
    return this._panel || this.skeleton.getPanel(this.panelName);
  }

  constructor(readonly skeleton: ISkeleton, readonly config: PanelDockConfig) {
    this.makeObservable();

    const { content, contentProps, panel, panelProps, name, props } = config;
    this.name = name;
    this.id = uniqueId(`panelDock:${name}$`);
    this.panelName = config.panelName || name;
    this.align = props?.align;
    if (content) {
      const _panelProps = { ...panelProps };

      this._panel = this.skeleton.add({
        type: 'Panel',
        name: this.panelName,
        props: _panelProps,
        contentProps,
        content: panel,
        area: panelProps?.area,
      }) as Panel;
    }
    if (props?.onInit) {
      props.onInit.call(this, this);
    }
  }

  makeObservable() {
    define(this, {
      _visible: observable.ref,
      actived: observable.computed,
      _disabled: observable.ref,
      panel: observable.computed,
    });
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

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
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

  togglePanel() {
    this.panel?.toggle();
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hidePanel() {
    this.panel?.setActive(false);
  }

  showPanel() {
    this.panel?.setActive(true);
  }
}

export function isPanelDock(obj: any): obj is PanelDock {
  return obj && obj.isPanelDock;
}
