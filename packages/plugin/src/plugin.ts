import { PluginManager } from './pluginManager'
import { __defaultExport } from './utils'
import { loggerWarning, lodash } from '@etfm/vea-shared'

export async function getPlugins() {
  const AppPlugins = import.meta.glob('/{.etfm,.etfmirc}.{ts,tsx}')
  if (lodash.isEmpty(AppPlugins)) {
    loggerWarning('请在跟目录下创建{.etfm,.etfmirc}.{ts,tsx}文件')
  }
  const AsyncAppPlugin = Object.values(AppPlugins)[0] as any
  const AppPlugin = await AsyncAppPlugin()
  return __defaultExport(AppPlugin)
}

function getValidKeys() {
  return ['render', 'router', 'pinia', 'http']
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
