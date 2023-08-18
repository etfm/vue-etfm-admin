import { Widget, isWidget } from './widget';
import { isVNode } from 'vue';
import { Logger, lodash } from '@etfma/shared';
import { Editor } from '../editor';

import {
  IPublicTypeDisposable,
  IPublicTypeWidgetBaseConfig,
  ISkeleton,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfma/types';

const logger = new Logger({ bizName: 'skeleton' });

export class Skeleton implements ISkeleton {
  readonly aside: IWidget[] = [];

  readonly header: IWidget[] = [];

  readonly toolbar: IWidget[] = [];

  readonly main: IWidget[] = [];

  readonly footer: IWidget[] = [];

  readonly extra: IWidget[] = [];

  readonly widgets: IWidget[] = [];

  readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  postEvent(event: SkeletonEvents, ...args: any[]) {
    this.editor.eventBus.emit(event, ...args);
  }

  createWidget(config: IPublicTypeWidgetBaseConfig | IWidget) {
    if (isWidget(config)) {
      return config;
    }

    config = this.parseConfig(config);
    const widget: IWidget = new Widget(this, config as WidgetConfig);
    this.widgets.push(widget);
    return widget;
  }

  getWidget(name: string): IWidget | undefined {
    return this.widgets.find((widget) => widget.name === name);
  }

  private parseConfig(config: IPublicTypeWidgetBaseConfig) {
    if (config.parsed) {
      return config;
    }
    const { content, ...restConfig } = config;
    if (content) {
      if (lodash.isPlainObject(content) && !isVNode(content)) {
        Object.keys(content).forEach((key) => {
          if (/props$/i.test(key) && restConfig[key]) {
            restConfig[key] = {
              ...restConfig[key],
              ...content[key],
            };
          } else {
            restConfig[key] = content[key];
          }
        });
      } else {
        restConfig.content = content;
      }
    }
    restConfig.pluginKey = restConfig.name;
    restConfig.parsed = true;

    if (!lodash.get(restConfig, 'props.align')) {
      lodash.set(restConfig, 'props.align', 'center');
    }

    return restConfig;
  }

  setWidget(config: IWidget, widgets) {
    widgets.push(config);
    this.postEvent(SkeletonEvents.ADD_WIDGET, config.name, this);
    return widgets;
  }

  onWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.editor.eventBus.on(SkeletonEvents.ADD_WIDGET, (name: any, widget: any) => {
      listener(name, widget);
    });
    return () => this.editor.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>) {
    const parsedConfig = {
      ...this.parseConfig(config),
      ...extraConfig,
    };

    const { area } = parsedConfig;

    const widget = this.createWidget(parsedConfig);

    switch (area) {
      case 'aside':
        return this.setWidget(widget, this.aside);
      case 'header':
        return this.setWidget(widget, this.header);
      case 'toolbar':
        return this.setWidget(widget, this.toolbar);
      case 'main':
        return this.setWidget(widget, this.main);
      case 'footer':
        return this.setWidget(widget, this.footer);
      case 'extra':
        return this.setWidget(widget, this.extra);
      default:
        logger.warn(`${config.name} not supported`);
    }
  }
}
