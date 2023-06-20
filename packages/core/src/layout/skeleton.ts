import { WidgetContainer, Panel, isPanel, Widget, isWidget, isPanelConfig } from './widget';
import { Area } from './area';
import { isVNode } from 'vue';
import { Logger, lodash } from '@etfma/shared';
import { Editor } from '../editor';

import { engineConfig } from '../config';
import {
  IContainer,
  IPublicTypeWidgetBaseConfig,
  ISkeleton,
  IWidget,
  PanelConfig,
  SkeletonEvents,
  WidgetConfig,
} from '@etfma/types';

const logger = new Logger({ bizName: 'skeleton' });

export class Skeleton implements ISkeleton {
  private panels = new Map<string, Panel>();

  private containers = new Map<string, IContainer>();

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
        return this.createWidget(config as PanelConfig);
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

        return this.createWidget(config as PanelConfig);
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

  /**
   * setup events
   *
   * @memberof Skeleton
   */
  setupEvents() {
    this.editor.on(SkeletonEvents.PANEL_SHOW, (panelName, panel) => {
      const panelNameKey = `${panelName}-pinned-status-isFloat`;
      const isInFloatAreaPreferenceExists = engineConfig
        .getPreference()
        ?.contains(panelNameKey, 'skeleton');
      if (isInFloatAreaPreferenceExists) {
        const isInFloatAreaFromPreference = engineConfig
          .getPreference()
          ?.get(panelNameKey, 'skeleton');
        const isCurrentInFloatArea = panel?.isChildOfFloatArea();
        if (isInFloatAreaFromPreference !== isCurrentInFloatArea) {
          this.toggleFloatStatus(panel);
        }
      }
    });
  }

  /**
   * set isFloat status for panel
   *
   * @param {*} panel
   * @memberof Skeleton
   */
  toggleFloatStatus(panel: Panel) {
    const isFloat = panel?.parent?.name === 'leftFloatArea';
    if (isFloat) {
      this.leftFloatArea.remove(panel);
      this.leftFixedArea.add(panel as unknown as PanelConfig);
      this.leftFixedArea.container.active(panel);
    } else {
      this.leftFixedArea.remove(panel);
      this.leftFloatArea.add(panel as unknown as PanelConfig);
      this.leftFloatArea.container.active(panel);
    }
    engineConfig.getPreference().set(`${panel.name}-pinned-status-isFloat`, !isFloat, 'skeleton');
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

  createPanel(config: PanelConfig) {
    const parsedConfig = this.parseConfig(config);
    const panel = new Panel(this, parsedConfig as PanelConfig);

    this.panels.set(panel.name, panel);
    logger.debug(
      `Panel created with name: ${panel.name} \nconfig:`,
      config,
      '\n current panels: ',
      this.panels,
    );
    return panel;
  }

  getPanel(name: string): Panel | undefined {
    return this.panels.get(name);
  }

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive = false,
    checkVisible: () => boolean = () => true,
  ) {
    const container = new WidgetContainer(name, handle, exclusive, checkVisible);
    this.containers.set(name, container);
    return container;
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
        return this.leftArea.add(parsedConfig as WidgetConfig);
      case 'rightArea':
      case 'right':
        return this.rightArea.add(parsedConfig as PanelConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig as WidgetConfig);
      case 'toolbar':
        return this.toolbar.add(parsedConfig as WidgetConfig);
      case 'mainArea':
      case 'main':
      case 'center':
      case 'centerArea':
        return this.mainArea.add(parsedConfig as PanelConfig);
      case 'bottomArea':
      case 'bottom':
        return this.bottomArea.add(parsedConfig as PanelConfig);
      case 'leftFixedArea':
        return this.leftFixedArea.add(parsedConfig as PanelConfig);
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig as PanelConfig);
      default:
      // do nothing
    }
  }
}
