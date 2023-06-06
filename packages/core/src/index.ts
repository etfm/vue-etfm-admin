import { App, createApp } from 'vue';
import {
  Editor,
  engineConfig,
  Designer,
  LowCodePluginManager,
  ILowCodePluginContextPrivate,
  ILowCodePluginContextApiAssembler,
  PluginPreference,
} from './core/core';
import { globalContext } from './di';

import { EngineOptions, IPublicModelDocumentModel } from '@elcplat/lowcode-types';
import { Skeleton as InnerSkeleton, Workbench } from './layout';

import { Hotkey, Project, Skeleton, Setters, Material, Event, Dragon, Global } from './shell';
import { getLogger, isPlainObject, Logger } from '@elcplat/lowcode-shared';
import { shellModelFactory } from './modules/shell-model-factory';

export * from './modules/lowcode-types';

import jsonPkg from '../../../lerna.json';
import { ILowCodePluginContext } from './modules/lowcode-types';

const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');
const global = new Global(globalContext);

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton' as any, innerSkeleton);

const skeleton = new Skeleton(innerSkeleton);
const material = new Material(editor);
const config = engineConfig;
const event = new Event(editor, { prefix: 'common' });
const logger = getLogger({ level: 'warn', bizName: 'common' }) as Logger;

const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
  assembleApis: (context: ILowCodePluginContextPrivate) => {
    context.skeleton = skeleton;
    context.material = material;
    context.event = event;
    context.config = config;
    context.global = global;
    context.editor = editor;
  },
};
const plugins = new LowCodePluginManager(pluginContextApiAssembler).toProxy();
editor.set('plugins' as any, plugins);

export { skeleton, plugins, material, config, event, logger, global, editor };
// export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
//   symbols,
//   classes,
// }

// 注册一批内置插件
(async function registerPlugins() {
  // 处理 editor.set('assets')，将组件元数据创建好
  const componentMetaParser = (ctx: ILowCodePluginContext) => {
    return {
      init() {
        editor.onGot('assets', (assets: any) => {
          const { components = [] } = assets;
          designer.buildComponentMetasMap(components);
        });
      },
    };
  };
  componentMetaParser.pluginName = '___component_meta_parser___';
  await plugins.register(componentMetaParser);
  // // 注册默认的 setters
  // const setterRegistry = (ctx: ILowCodePluginContext) => {
  //   return {
  //     init() {
  //       if (engineConfig.get('disableDefaultSetters')) return
  //       const builtinSetters = require('@alilc/lowcode-engine-ext')?.setters
  //       if (builtinSetters) {
  //         ctx.setters.registerSetter(builtinSetters)
  //       }
  //     },
  //   }
  // }
  // setterRegistry.pluginName = '___setter_registry___'
  // await plugins.register(setterRegistry)
  // 注册默认的面板
  // const defaultPanelRegistry = (ctx: ILowCodePluginContext) => {
  //   return {
  //     init() {
  //       // ctx.skeleton.add({
  //       //   area: 'topArea',
  //       //   name: 'logo',
  //       //   type: 'Widget',
  //       //   content: '图标',
  //       //   props: {
  //       //     align: 'left',
  //       //   },
  //       // })
  //       // skeleton.add({
  //       //   area: 'mainArea',
  //       //   name: 'designer',
  //       //   type: 'Widget',
  //       //   content: DesignerPlugin,
  //       // })
  //       // if (!engineConfig.get('disableDefaultSettingPanel')) {
  //       //   skeleton.add({
  //       //     area: 'rightArea',
  //       //     name: 'settingsPane',
  //       //     type: 'Panel',
  //       //     content: SettingsPrimaryPane,
  //       //     props: {
  //       //       ignoreRoot: true,
  //       //     },
  //       //   })
  //       // }
  //       // // by default in float area;
  //       // let isInFloatArea = true
  //       // const hasPreferenceForOutline = editor
  //       //   ?.getPreference()
  //       //   ?.contains('outline-pane-pinned-status-isFloat', 'skeleton')
  //       // if (hasPreferenceForOutline) {
  //       //   isInFloatArea = editor
  //       //     ?.getPreference()
  //       //     ?.get('outline-pane-pinned-status-isFloat', 'skeleton')
  //       // }
  //       // skeleton.add({
  //       //   area: 'leftArea',
  //       //   name: 'outlinePane',
  //       //   type: 'PanelDock',
  //       //   content: Outline,
  //       //   panelProps: {
  //       //     area: isInFloatArea ? 'leftFloatArea' : 'leftFixedArea',
  //       //     keepVisibleWhileDragging: true,
  //       //     ...engineConfig.get('defaultOutlinePaneProps'),
  //       //   },
  //       //   contentProps: {
  //       //     treeTitleExtra: engineConfig.get('treeTitleExtra'),
  //       //   },
  //       // })
  //       // skeleton.add({
  //       //   area: 'rightArea',
  //       //   name: 'backupOutline',
  //       //   type: 'Panel',
  //       //   props: {
  //       //     condition: () => {
  //       //       return (
  //       //         designer.dragon.dragging &&
  //       //         !getTreeMaster(designer).hasVisibleTreeBoard()
  //       //       )
  //       //     },
  //       //   },
  //       //   content: OutlineBackupPane,
  //       // })
  //     },
  //   }
  // }
  // defaultPanelRegistry.pluginName = '___default_panel___'
  // await plugins.register(defaultPanelRegistry)
})();

// container which will host LowCodeEngine DOM
let engineContainer: HTMLElement;
let app: App;
// @ts-ignore webpack Define variable
export const version = jsonPkg.version;
engineConfig.set('ENGINE_VERSION', version);

export async function init(
  container?: HTMLElement,
  options?: EngineOptions,
  pluginPreference?: PluginPreference,
) {
  await destroy();
  let engineOptions: null | HTMLElement = null;
  if (isPlainObject(container)) {
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
