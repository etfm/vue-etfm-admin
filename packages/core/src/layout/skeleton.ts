import { action, define } from '../obx';
import {
  DockConfig,
  PanelConfig,
  WidgetConfig,
  PanelDockConfig,
  isPanelDockConfig,
  isPanelConfig,
} from './types';
import { WidgetContainer, Panel, isPanel, Widget, isWidget, IWidget, PanelDock } from './widget';
import { Area } from './area';
import { isVNode } from 'vue';
import { Logger, lodash } from '@etfma/shared';
import { Editor, IEditor } from '../core/core';
import { EditorConfig, PluginClassSet } from '../types/core';
import { IPublicApiSkeleton, IWidgetBaseConfig, IWidgetConfigArea } from '../types/api';
import {
  IPublicTypeSkeletonConfig,
  IPublicTypeWidgetBaseConfig,
} from '../types/widget-base-config';
import { engineConfig } from '../config/config';

const logger = new Logger({ bizName: 'skeleton' });

export enum SkeletonEvents {
  PANEL_DOCK_ACTIVE = 'skeleton.panel-dock.active',
  PANEL_DOCK_UNACTIVE = 'skeleton.panel-dock.unactive',
  PANEL_SHOW = 'skeleton.panel.show',
  PANEL_HIDE = 'skeleton.panel.hide',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
  WIDGET_DISABLE = 'skeleton.widget.disable',
  WIDGET_ENABLE = 'skeleton.widget.enable',
}

export interface ISkeleton
  extends Omit<
    IPublicApiSkeleton,
    | 'showPanel'
    | 'hidePanel'
    | 'showWidget'
    | 'enableWidget'
    | 'hideWidget'
    | 'disableWidget'
    | 'showArea'
    | 'onShowPanel'
    | 'onHidePanel'
    | 'onShowWidget'
    | 'onHideWidget'
    | 'remove'
    | 'hideArea'
    | 'add'
  > {
  editor: IEditor;

  readonly leftArea: Area<DockConfig | PanelDockConfig>;

  readonly topArea: Area<DockConfig | PanelDockConfig>;

  readonly toolbar: Area<DockConfig | PanelDockConfig>;

  readonly leftFixedArea: Area<PanelConfig, Panel>;

  readonly leftFloatArea: Area<PanelConfig, Panel>;

  readonly rightArea: Area<PanelConfig, Panel>;

  readonly mainArea: Area<WidgetConfig | PanelConfig, Widget | Panel>;

  readonly bottomArea: Area<PanelConfig, Panel>;

  readonly widgets: IWidget[];

  getPanel(name: string): Panel | undefined;

  getWidget(name: string): IWidget | undefined;

  buildFromConfig(config?: EditorConfig, components?: PluginClassSet): void;

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive?: boolean,
    checkVisible?: () => boolean,
    defaultSetCurrent?: boolean,
  ): WidgetContainer;

  createPanel(config: PanelConfig): Panel;

  add(
    config: IPublicTypeSkeletonConfig,
    extraConfig?: Record<string, any>,
  ): IWidget | Widget | Panel | PanelDock | undefined;

  toggleFloatStatus(panel: Panel): void;
  postEvent(event: SkeletonEvents, ...args: any[]): void;
}

export class Skeleton {
  private panels = new Map<string, Panel>();

  private containers = new Map<string, WidgetContainer<any>>();

  readonly leftArea: Area<DockConfig | PanelDockConfig>;

  readonly topArea: Area<DockConfig | PanelDockConfig>;

  readonly toolbar: Area<DockConfig | PanelDockConfig>;

  readonly leftFixedArea: Area<PanelConfig, Panel>;

  readonly leftFloatArea: Area<PanelConfig, Panel>;

  readonly rightArea: Area<PanelConfig, Panel>;

  readonly mainArea: Area<WidgetConfig | PanelConfig, Widget | Panel>;

  readonly bottomArea: Area<PanelConfig, Panel>;

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
      false,
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
      false,
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
      false,
    );
    this.leftFixedArea = new Area(
      this,
      'leftFixedArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true,
      true,
    );
    this.leftFloatArea = new Area(
      this,
      'leftFloatArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }

        return this.createPanel(config);
      },
      true,
      true,
    );
    this.rightArea = new Area(
      this,
      'rightArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      false,
      true,
    );
    this.mainArea = new Area(
      this,
      'mainArea',
      (config) => {
        if (isWidget(config)) {
          return config as Widget;
        }
        return this.createWidget(config) as Widget;
      },
      true,
      true,
    );
    this.bottomArea = new Area(
      this,
      'bottomArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true,
    );

    // this.setupPlugins()
    this.setupEvents();
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      toggleFloatStatus: action,
    });
  }
  /**
   * setup events
   *
   * @memberof Skeleton
   */
  setupEvents() {
    // adjust pinned status when panel shown
    this.editor.on('skeleton.panel.show', (panelName, panel) => {
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
      this.leftFixedArea.add(panel);
      this.leftFixedArea.container.active(panel);
    } else {
      this.leftFixedArea.remove(panel);
      this.leftFloatArea.add(panel);
      this.leftFloatArea.container.active(panel);
    }
    engineConfig.getPreference().set(`${panel.name}-pinned-status-isFloat`, !isFloat, 'skeleton');
  }

  buildFromConfig(config?: EditorConfig) {
    if (config) {
      this.editor.init(config);
    }
    this.setupPlugins();
  }

  private setupPlugins() {
    const { config } = this.editor;
    if (!config) {
      return;
    }

    const { plugins } = config;
    if (!plugins) {
      return;
    }
    Object.keys(plugins).forEach((area) => {
      plugins[area].forEach((item) => {
        const { pluginKey, props = {}, pluginProps } = item;
        const config: Partial<IWidgetBaseConfig> = {
          area: area as IWidgetConfigArea,
          type: 'Widget',
          name: pluginKey,
          contentProps: pluginProps,
        };
        const { panelProps, ...restProps } = props;
        config.props = restProps;
        if (panelProps) {
          config.panelProps = panelProps;
        }
        this.add(config as IWidgetBaseConfig);
      });
    });
  }

  postEvent(event: SkeletonEvents, ...args: any[]) {
    this.editor.eventBus.emit(event, ...args);
  }

  createWidget(config: IPublicTypeWidgetBaseConfig | IWidget) {
    if (isWidget(config)) {
      return config;
    }

    config = this.parseConfig(config);
    let widget: IWidget;
    if (isPanelDockConfig(config)) {
      widget = new PanelDock(this, config);
    } else if (isPanelConfig(config)) {
      widget = this.createPanel(config);
    } else {
      widget = new Widget(this, config as WidgetConfig);

      console.log('skeleton:createWidget:', widget, config);
    }
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
    defaultSetCurrent = false,
  ) {
    const container = new WidgetContainer(name, handle, exclusive, checkVisible, defaultSetCurrent);
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

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>) {
    const parsedConfig = {
      ...this.parseConfig(config),
      ...extraConfig,
    };

    console.log('skeleton:add:parsedConfig:', parsedConfig);

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
        return this.leftArea.add(parsedConfig as PanelDockConfig);
      case 'rightArea':
      case 'right':
        return this.rightArea.add(parsedConfig as PanelConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig as PanelDockConfig);
      case 'toolbar':
        return this.toolbar.add(parsedConfig as PanelDockConfig);
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
