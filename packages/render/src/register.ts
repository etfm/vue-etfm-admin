import { createPluginManager, getPluginManager } from '@etfm/vea-plugin'
import { lodash } from '@etfm/vea-shared'
import { initRender } from './renderer'
import type { App } from 'vue'
import RootApp from './App.vue'
import type { Router } from 'vue-router'
import type { Pinia } from 'pinia'

export interface IContext {
  rootElement?: App | Element | Function | Promise<Function>
  rootContainer?: App | Function | Promise<Function>
  onRouterCreated?: (opts?: { router: Router }) => void | Promise<void>
  onPiniaCreated?: (opts?: { pinia: Pinia }) => void | Promise<void>
  onAppCreated?: (opts?: { app: App; router: Router; pinia: Pinia }) => void | Promise<void>
  onMounted?: (opts: { app: App; router: Router; pinia: Pinia }) => Promise<void> | void
}

export let context: IContext = {
  rootElement: document.getElementById('app') as Element,
  rootContainer: RootApp,
  onRouterCreated: () => {},
  onPiniaCreated: () => {},
  onAppCreated: () => {},
  onMounted: () => {}
}

export async function register(opts?: IContext) {
  const pluginManager = await createPluginManager()
  // 收集配置信息
  const render = getPluginManager().applyPlugins({
    key: 'render'
  })

  context = lodash.merge(context, opts, render)

  return initRender({ pluginManager })
}

register()
