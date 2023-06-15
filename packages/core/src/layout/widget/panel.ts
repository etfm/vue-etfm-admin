import { observable, define } from '../../obx';
import { PanelView } from '../components/widget';
import { createElement } from '../../utils';
import { uniqueId } from '../../utils/unique-id';
import { getEvent } from '../../shell';
import { createModuleEventBus } from '../../event-bus';
import type { IEventBus, IPanel, PanelConfig, ISkeleton, IContainer } from '@etfma/types';

export class Panel implements IPanel {
  readonly isWidget = true;

  readonly name: string;

  readonly id: string;

  readonly isPanel = true;

  private emitter: IEventBus = createModuleEventBus('Panel');

  private container?: IContainer;

  public parent?: IContainer;

  inited = false;

  _actived = false;

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

  constructor(readonly skeleton: ISkeleton, readonly config: PanelConfig) {
    this.makeObservable();

    const { name, content, props = {} } = config;
    this.name = name;
    this.id = uniqueId(`pane:${name}$`);
    if (Array.isArray(content)) {
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

    if (typeof content !== 'string' && content && (content as any).onInit) {
      (content as any).onInit.call(this, this);
    }
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

  setParent(parent: IContainer) {
    if (parent === this.parent) {
      return;
    }
    if (this.parent) {
      this.parent.remove(this);
    }
    this.parent = parent;
  }

  add(item: PanelConfig) {
    return this.container?.add(item);
  }

  getPane(name: string): IPanel | null {
    return this.container?.get(name) || null;
  }

  remove(item: IPanel | string) {
    return this.container?.remove(item);
  }

  active(item?: IPanel | string | null) {
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
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel;
}

export function isPanelConfig(obj: any): obj is PanelConfig {
  return obj && obj.type === 'Panel';
}
