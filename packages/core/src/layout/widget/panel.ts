import { EventEmitter } from 'events';
import { observable, define } from '../../obx';
import { WidgetContainer } from './container';
import { PanelConfig } from '../types';
import { PanelView } from '../components/widget';
import { Skeleton } from '../skeleton';
import { IWidget } from './widget';
import { isPanelDock, PanelDock } from './panel-dock';
import { createElement } from '../../utils';
import { uniqueId } from '../../utils/unique-id';
import { getEvent } from '../../shell';

export class Panel implements IWidget {
  readonly isWidget = true;

  readonly name: string;

  readonly id: string;

  inited = false;

  _actived = false;

  private emitter = new EventEmitter();

  get actived(): boolean {
    return this._actived;
  }

  get visible(): boolean {
    if (!this.parent || this.parent.visible) {
      const { props } = this.config;
      if (props?.condition) {
        return props.condition(this);
      }
      return this._actived;
    }
    return false;
  }

  readonly isPanel = true;

  get body() {
    const { content, contentProps } = this.config;
    return createElement(content, {
      ...contentProps,
      editor: getEvent(this.skeleton.editor),
      config: this.config,
      panel: this,
    });
  }

  get content() {
    const area = this.config?.area || this.parent?.name;
    return createElement(PanelView, {
      panel: this,
      key: this.id,
      area,
    });
  }

  private container?: WidgetContainer<Panel, PanelConfig>;

  public parent?: WidgetContainer;

  constructor(readonly skeleton: Skeleton, readonly config: PanelConfig) {
    const { name, content, props = {} } = config;
    this.name = name;
    this.id = uniqueId(`pane:${name}$`);
    if (Array.isArray(content)) {
      if (content.length === 1) {
        // todo: not show tabs
      }
      this.container = this.skeleton.createContainer(
        name,
        (item) => {
          if (isPanel(item)) {
            return item;
          }
          return this.skeleton.createPanel(item);
        },
        true,
        () => this.visible,
        true,
      );
      content.forEach((item) => this.add(item));
    }
    if (props.onInit) {
      props.onInit.call(this, this);
    }

    if ((content as any).onInit) {
      (content as any).onInit.call(this, this);
    }
    // todo: process shortcut
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      inited: observable.ref,
      _actived: observable.ref,
      actived: observable.computed,
      visible: observable.computed,
      parent: observable.ref,
    });
  }

  setParent(parent: WidgetContainer) {
    if (parent === this.parent) {
      return;
    }
    if (this.parent) {
      this.parent.remove(this);
    }
    this.parent = parent;
  }

  add(item: Panel | PanelConfig) {
    return this.container?.add(item);
  }

  getPane(name: string): Panel | null {
    return this.container?.get(name) || null;
  }

  remove(item: Panel | string) {
    return this.container?.remove(item);
  }

  active(item?: Panel | string | null) {
    if (item) {
      this.container?.active(item);
    } else {
      this.setActive(true);
    }
  }

  disable() {}

  enable(): void {}

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  /**
   * check is current panel is in float area or not
   *
   * @returns {boolean}
   * @memberof Panel
   */
  isChildOfFloatArea(): boolean {
    return this.parent?.name === 'leftFloatArea';
  }

  /**
   * check is current panel is in fixed area or not
   *
   * @returns {boolean}
   * @memberof Panel
   */
  isChildOfFixedArea(): boolean {
    return this.parent?.name === 'leftFixedArea';
  }

  setActive(flag: boolean) {
    if (flag === this._actived) {
      // TODO: 如果移动到另外一个 container，会有问题
      return;
    }
    if (flag) {
      // 对于 Area 的直接 Child，要专门处理 Float & Fixed 分组切换, 其他情况不需要
      if (this.isChildOfFloatArea()) {
        this.skeleton.leftFixedArea.container.unactiveAll();
      } else if (this.isChildOfFixedArea()) {
        this.skeleton.leftFloatArea.container.unactiveAll();
      }
      this._actived = true;
      this.parent?.active(this);
      if (!this.inited) {
        this.inited = true;
      }
      this.emitter.emit('activechange', true);
    } else if (this.inited) {
      if (this.parent?.name && this.name.startsWith(this.parent.name)) {
        this.inited = false;
      }
      this._actived = false;
      this.parent?.unactive(this);
      this.emitter.emit('activechange', false);
    }
  }

  toggle() {
    this.setActive(!this._actived);
  }

  hide() {
    this.setActive(false);
  }

  show() {
    this.setActive(true);
  }

  getAssocDocks(): PanelDock[] {
    return this.skeleton.widgets.filter((item) => {
      return isPanelDock(item) && item.panelName === this.name;
    }) as any;
  }

  /**
   * @deprecated
   */
  getSupportedPositions() {
    return ['default'];
  }

  /**
   * @deprecated
   */
  getCurrentPosition() {
    return 'default';
  }

  /**
   * @deprecated
   */
  setPosition(/* position: string */) {
    // noop
  }

  /**
   * @deprecated
   */
  onActiveChange(fn: (flag: boolean) => void): () => void {
    this.emitter.on('activechange', fn);
    return () => {
      this.emitter.removeListener('activechange', fn);
    };
  }
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel;
}
