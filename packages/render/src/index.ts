import { renderClient } from './browser'
import { createPluginManager, createConfigManager } from '@etfm/vea-plugin'
import { ApplyPluginsType } from '@etfm/vea-core'

async function render() {
  const pluginManager = await createPluginManager()
  const configManager = await createConfigManager()

  const contextOpts = pluginManager.applyPlugins({
    key: 'modifyContextOpts',
    type: ApplyPluginsType.modify,
    initialValue: {}
  })

  const config = configManager.getConfig()

  return pluginManager.applyPlugins({
    key: 'render',
    type: ApplyPluginsType.compose,
    initialValue() {
      const context = {
        pluginManager,
        configManager,
        config,
        rootElement: contextOpts.rootElement || document.getElementById('app')
      }
      const modifiedContext = pluginManager.applyPlugins({
        key: 'modifyClientRenderOpts',
        type: ApplyPluginsType.modify,
        initialValue: context
      })
      return renderClient(modifiedContext)
    }
  })()
}

render()
