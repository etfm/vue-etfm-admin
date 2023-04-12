import { ConfigManager } from '@etfm/vea-core'
import { __defaultExport } from './utils'

export async function getConfigs() {
  const ConfigPlugins = import.meta.glob('/.etfmirc.{ts,tsx}')
  const AsyncConfigPlugin = Object.values(ConfigPlugins)[0] as any
  const ConfigPlugin = await AsyncConfigPlugin()
  return __defaultExport(ConfigPlugin)
}
function getValidKeys() {
  return ['router']
}

let configManager: ConfigManager

export async function createConfigManager() {
  configManager = ConfigManager.create({
    config: await getConfigs(),
    validKeys: getValidKeys()
  })

  return configManager
}

export function getConfigManager() {
  return configManager
}
