import { Widget, isWidget } from './widget';
import { Area } from './area';
import { isVNode } from 'vue';
import { Logger, lodash } from '@etfma/shared';
import { Editor } from '../editor';

import {
  IPublicTypeWidgetBaseConfig,
  ISkeleton,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfma/types';

const logger = new Logger({ bizName: 'skeleton' });

export class Skeleton implements ISkeleton {
  readonly aside: Area;

  readonly header: Area;

  readonly toolbar: Area;

  readonly breadcrumb: Area;

  readonly fixed: Area;

  readonly float: Area;

  readonly main: Area;

  readonly footer: Area;

  readonly widgets: IWidget[] = [];

  readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;

    this.aside = new Area(
      this,
      'aside',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.header = new Area(
      this,
      'header',
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
    this.breadcrumb = new Area(
      this,
      'breadcrumb',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.fixed = new Area(
      this,
      'fixed',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.float = new Area(
      this,
      'float',
      (config) => {
        if (isWidget(config)) {
          return config;
        }

        return this.createWidget(config);
      },
      false,
    );
    this.main = new Area(
      this,
      'main',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
    this.footer = new Area(
      this,
      'footer',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      true,
    );
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

  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>) {
    const parsedConfig = {
      ...this.parseConfig(config),
      ...extraConfig,
    };

    const { area } = parsedConfig;

    switch (area) {
      case 'aside':
        return this.aside.add(parsedConfig);
      case 'header':
        return this.header.add(parsedConfig);
      case 'toolbar':
        return this.toolbar.add(parsedConfig);
      case 'breadcrumb':
        return this.breadcrumb.add(parsedConfig);
      case 'main':
        return this.main.add(parsedConfig);
      case 'footer':
        return this.footer.add(parsedConfig);
      case 'fixed':
        return this.fixed.add(parsedConfig);
      case 'float':
        return this.float.add(parsedConfig);
      default:
        logger.warn(`${config.name} not supported`);
    }
  }
}
