import { Widget } from './widget';
import { isVNode } from 'vue';
import { lodash } from '@etfm/shared';

import {
  IPublicTypeDisposable,
  IPublicTypeWidgetBaseConfig,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfm/types';
import { EventBus, createModuleEventBus } from '../event-bus';

export class Skeleton {
  readonly widgets: Widget[] = [];

  readonly eventBus: EventBus;

  constructor() {
    this.eventBus = createModuleEventBus('skeleton');
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

  postEvent(event: SkeletonEvents, ...args: any[]) {
    this.eventBus.emit(event, ...args);
  }

  createWidget(config: IPublicTypeWidgetBaseConfig | IWidget) {
    config = this.parseConfig(config as IPublicTypeWidgetBaseConfig);
    const widget: Widget = new Widget(this, config as WidgetConfig);
    this.widgets.push(widget);
    return widget;
  }

  getWidget(name: string): Widget | undefined {
    return this.widgets.find((widget) => widget.name === name);
  }

  setWidget(config: IWidget, widgets) {
    widgets.push(config);
    this.postEvent(SkeletonEvents.ADD_WIDGET, config, widgets, this);
    return widgets;
  }

  onWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.eventBus.on(
      SkeletonEvents.ADD_WIDGET,
      (config: any, widgets: IWidget[], skeleton: any) => {
        listener(config, widgets, skeleton);
      },
    );
    return () => this.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>) {
    const parsedConfig = {
      ...this.parseConfig(config),
      ...extraConfig,
    };

    return this.createWidget(parsedConfig);
  }

  remove(name: string) {
    const i = this.widgets.findIndex((item) => item.name === name);
    if (i > -1) {
      this.widgets.splice(i, 1);
    }

    this.postEvent(SkeletonEvents.REMOVE_WIDGET, this.widgets[i], this.widgets, this);
  }
}
