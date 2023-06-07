import { App, createApp } from 'vue';
import { Editor, commonEvent } from './core/core';
import { globalContext } from './di';

import { Skeleton as InnerSkeleton, Workbench } from './layout';

import { Skeleton, Material, Event, Global, Plugins } from './shell';
import { lodash, Logger } from '@etfma/shared';

import jsonPkg from '../../../package.json';
import {
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
  PluginManager,
  PluginPreference,
} from './plugin';
import { IPublicTypeEngineOptions } from './types/engine-options';
import { engineConfig } from './config/config';
import { IPublicModelPluginContext } from './types/plugin-context';
import { IPublicTypePluginMeta } from './types/plugin-meta';

const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');
const global = new Global(globalContext);

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton' as any, innerSkeleton);

const skeleton = new Skeleton(innerSkeleton, 'any');
const material = new Material(editor);
const config = engineConfig;
const event = new Event(editor as any, { prefix: 'common' });
const logger = new Logger({ bizName: 'common' });
let plugins: Plugins;

const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
  assembleApis: (
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ) => {
    context.skeleton = skeleton;
    context.material = material;
    const eventPrefix = meta?.eventPrefix || 'common';
    context.event = new Event(commonEvent, { prefix: eventPrefix });
    context.config = config;
    context.global = global;
    context.editor = editor;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins', innerPlugins);
editor.set('plugins', plugins);

export { skeleton, plugins, material, config, event, logger, global, editor };
// export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
//   symbols,
//   classes,
// }

// 注册一批内置插件
(async function registerPlugins() {
  // 处理 editor.set('assets')，将组件元数据创建好
  const componentMetaParser = (ctx: IPublicModelPluginContext) => {
    return {
      init() {
        editor.onGot('assets', (assets: any) => {});
      },
    };
  };
  componentMetaParser.pluginName = '___component_meta_parser___';
  await plugins.register(componentMetaParser);
})();

// container which will host LowCodeEngine DOM
let engineContainer: HTMLElement;
let app: App;
// @ts-ignore webpack Define variable
export const version = jsonPkg.version;
engineConfig.set('ENGINE_VERSION', version);

export async function init(
  container?: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: PluginPreference,
) {
  await destroy();
  let engineOptions: null | HTMLElement = null;
  if (lodash.isPlainObject(container)) {
    engineOptions = container;
    engineContainer = document.createElement('div');
    engineContainer.id = 'engine';
    document.body.appendChild(engineContainer);
  } else {
    engineOptions = options;
    engineContainer = container;
    if (!container) {
      engineContainer = document.createElement('div');
      engineContainer.id = 'engine';
      document.body.appendChild(engineContainer);
    }
  }

  engineConfig.setEngineOptions(engineOptions as any);

  app = createApp({
    render: (h: any) =>
      h(Workbench, {
        skeleton: innerSkeleton,
        class: 'engine-main',
      }),
  });
  engineConfig.set('app', app);
  globalContext.register(app, 'app');

  await plugins.init(pluginPreference as any);

  app.mount(engineContainer);
}

export async function destroy() {
  // remove all documents
  // TODO: delete plugins except for core plugins
  // unmount DOM container, this will trigger React componentWillUnmount lifeCycle,
  // so necessary cleanups will be done.
  app && app.unmount();
}
