import { Widget, isWidget } from './widget';
import { Area } from './area';
import { isVNode } from 'vue';
import { Logger, lodash } from '@etfma/shared';
import { Editor } from '../editor';

import { engineConfig } from '../config';
import {
  IPublicTypeWidgetBaseConfig,
  ISkeleton,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfma/types';

const logger = new Logger({ bizName: 'skeleton' });

export class Skeleton implements ISkeleton {
  readonly leftArea: Area;

  readonly topArea: Area;

  readonly toolbar: Area;

  readonly leftFixedArea: Area;

  readonly leftFloatArea: Area;

  readonly rightArea: Area;

  readonly mainArea: Area;

  readonly bottomArea: Area;

  readonly widgets: IWidget[] = [];

  constructor(readonly editor: Editor) {
    this.leftArea = new Area(
      this,
      'leftArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.topArea = new Area(
      this,
      'topArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.toolbar = new Area(
      this,
      'toolbar',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.leftFixedArea = new Area(
      this,
      'leftFixedArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.leftFloatArea = new Area(
      this,
      'leftFloatArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }

        return this.createWidget(config);
      },
      false,
    );
    this.rightArea = new Area(
      this,
      'rightArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.mainArea = new Area(
      this,
      'mainArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.bottomArea = new Area(
      this,
      'bottomArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );

    this.setupEvents();
  }

  setupEvents() {
    this.editor.on(SkeletonEvents.PANEL_SHOW, (name, widget: Widget) => {
      const nameKey = `${name}-status-isFloat`;
      const isInFloatAreaPreferenceExists = engineConfig
        .getPreference()
        ?.contains(nameKey, 'skeleton');
      if (isInFloatAreaPreferenceExists) {
        const isInFloatAreaFromPreference = engineConfig.getPreference()?.get(nameKey, 'skeleton');
        const isCurrentInFloatArea = widget?.isFloatArea();
        if (isInFloatAreaFromPreference !== isCurrentInFloatArea) {
          this.toggleFloatStatus(widget);
        }
      }
    });
  }

  toggleFloatStatus(widget: Widget) {
    const isFloat = widget?.isFloatArea();
    if (isFloat) {
      this.leftFloatArea.remove(widget);
      this.leftFixedArea.add(widget as unknown as IPublicTypeWidgetBaseConfig);
    } else {
      this.leftFixedArea.remove(widget);
      this.leftFloatArea.add(widget as unknown as IPublicTypeWidgetBaseConfig);
    }
    engineConfig.getPreference().set(`${widget.name}-status-isFloat`, !isFloat, 'skeleton');
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
    return restConfig;
  }

  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>) {
    const parsedConfig = {
      ...this.parseConfig(config),
      ...extraConfig,
    };

    let { area } = parsedConfig;
    if (!area) {
      if (parsedConfig.type === 'Panel') {
        area = 'leftFixedArea';
      } else if (parsedConfig.type === 'Widget') {
        area = 'mainArea';
      } else {
        area = 'leftArea';
      }
    }

    switch (area) {
      case 'leftArea':
      case 'left':
        return this.leftArea.add(parsedConfig);
      case 'rightArea':
      case 'right':
        return this.rightArea.add(parsedConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig);
      case 'toolbar':
        return this.toolbar.add(parsedConfig);
      case 'mainArea':
      case 'main':
      case 'center':
      case 'centerArea':
        return this.mainArea.add(parsedConfig);
      case 'bottomArea':
      case 'bottom':
        return this.bottomArea.add(parsedConfig);
      case 'leftFixedArea':
        return this.leftFixedArea.add(parsedConfig);
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig);
      default:
      // do nothing
    }
  }
}
