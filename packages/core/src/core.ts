import { createApp } from 'vue';
import { editor, commonEvent } from './editor';
import { Skeleton as InnerSkeleton } from './layout';
import { Skeleton, Material, Event, Global, Plugins, Config } from './shell';
import { lodash, Logger } from '@etfma/shared';

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
} from '@etfma/types';
import { PluginManager } from './plugin';

import { globalI18n } from './intl/i18n';
import { Common } from './shell/common';
import { App } from './layout/layouts';
import { globalRouter } from './router/router';
import { globalTheme } from './theme/theme';

export * from './router';
export * from './intl';

export * from './types';

const global = new Global(editor);

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton', innerSkeleton);

const common = new Common(editor, innerSkeleton);
editor.set('common', common);

const app = createApp(App);
editor.set('app', app);

const material = new Material(editor);
editor.set('material', material);

const skeleton = new Skeleton(innerSkeleton);

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
    context.common = common;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins', innerPlugins);
editor.set('plugins', plugins);

export { skeleton, plugins, material, config, event, logger, global, common };
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  symbols,
  classes,
};

// 全局属性
(window as any).EtfmEngine = editor;

export const version = jsonPkg.version;
engineConfig.set('ENGINE_VERSION', version);

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

  engineConfig.setConfig(engineOptions);

  initInnerUtils();

  await plugins.init(pluginPreference);

  use();

  app.mount(engineContainer as Element);
}

function initInnerUtils() {
  globalI18n.init();
  globalRouter.init();
  globalTheme.init();
}

function use() {
  const router = common.utils.createRouter().router;
  const i18n = common.utils.createIntl().i18n;
  app.use(router);
  app.use(i18n);
}
