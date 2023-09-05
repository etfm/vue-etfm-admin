import { createApp } from 'vue';
import { editor, commonEvent } from './editor';
import { Skeleton as InnerSkeleton } from './layout';
import { Skeleton, Material, Event, Global, Plugins, Config, Theme, Intl, Route } from './shell';
import { lodash, Logger } from '@etfm/shared';

import jsonPkg from '../../../package.json';
import { engineConfig } from './config';

import symbols from './symbols';
import classes from './classes';
import {
  IPluginContextApiAssembler,
  IPluginContextPrivate,
  IPluginPreference,
  IPublicApiPlugins,
  IPublicTypeEngineOptions,
  IPublicTypePluginMeta,
} from '@etfm/types';
import { PluginManager } from './plugin';

import { globalI18n } from './intl/i18n';
import { globalRouter } from './router/router';
import { globalTheme } from './theme/theme';

import { App } from './layout/layouts';

export * from './router';
export * from './intl';

export * from './types';

const global = new Global(editor);

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton', innerSkeleton);

const theme = new Theme(editor, globalTheme);
editor.set('theme', theme);

const i18n = new Intl(editor, globalI18n);
editor.set('i18n', i18n);

const router = new Route(editor, globalRouter);
editor.set('router', router);

const material = new Material(editor);
editor.set('material', material);

const skeleton = new Skeleton(innerSkeleton, engineConfig);

const config = new Config(engineConfig);

const event = new Event(commonEvent, { prefix: 'common' });
const logger = new Logger({ bizName: 'common' });

let plugins: IPublicApiPlugins;

const pluginContextApiAssembler: IPluginContextApiAssembler = {
  assembleApis: (
    context: IPluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ) => {
    context.skeleton = skeleton;
    context.material = material;
    const eventPrefix = meta?.eventPrefix || 'common';
    context.event = new Event(commonEvent, { prefix: eventPrefix });
    context.config = config;
    context.global = global;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins', innerPlugins);
editor.set('plugins', plugins);

export { skeleton, plugins, material, config, event, logger, global, theme, i18n, router };
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  symbols,
  classes,
};

// 全局属性
(window as any).EtfmEngine = editor;

export const version = jsonPkg.version;
engineConfig.set('version', version);

let engineContainer: HTMLElement | undefined;

export async function init(
  container?: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: IPluginPreference,
) {
  let engineOptions: IPublicTypeEngineOptions;
  if (lodash.isPlainObject(container)) {
    engineOptions = container as IPublicTypeEngineOptions;
    engineContainer = document.createElement('div');
    engineContainer.id = 'engine';
    document.body.appendChild(engineContainer);
  } else {
    engineOptions = options!;
    engineContainer = container;
    if (!container) {
      engineContainer = document.createElement('div');
      engineContainer.id = 'engine';
      document.body.appendChild(engineContainer);
    }
  }

  const app = createApp(App);
  editor.set('app', app);

  engineConfig.setEngineOptions(engineOptions);

  initInner();

  await plugins.init(pluginPreference);

  use(app);

  app.mount(engineContainer as Element);
}

function initInner() {
  globalI18n.init();
  globalRouter.init();
  globalTheme.init();
}

function use(app) {
  app.use(router.router);
  app.use(i18n.i18n);
}
