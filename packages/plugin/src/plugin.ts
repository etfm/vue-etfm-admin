import { PluginManager } from '@etfm/vea-core'
import { __defaultExport } from './utils'
import { loggerWarning, lodash } from '@etfm/vea-shared'

export async function getPlugins() {
  const AppPlugins = import.meta.glob('/src/runtime.{ts,tsx}')
  if (lodash.isEmpty(AppPlugins)) {
    loggerWarning('请在src目录下创建runtime.{ts,tsx}文件')
  }
  const AsyncAppPlugin = Object.values(AppPlugins)[0] as any
  const AppPlugin = await AsyncAppPlugin()
  return __defaultExport(AppPlugin)
}

function getValidKeys() {
  return [
    'modifyContextOpts',
    'modifyClientRenderOpts',
    'rootContainer',
    'innerProvider',
    'i18nProvider',
    'accessProvider',
    'dataflowProvider',
    'outerProvider',
    'render',
    'router',
    'onInitTransformRoute',
    'onRouterCreated',
    'onAppCreated',
    'onMounted'
  ]
}

let pluginManager: PluginManager

export async function createPluginManager() {
  pluginManager = PluginManager.create({
    plugin: await getPlugins(),
    validKeys: getValidKeys()
  })

  return pluginManager
}

export function getPluginManager() {
  return pluginManager
}
