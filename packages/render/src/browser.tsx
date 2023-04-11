import App from './App.vue'
import { createApp } from 'vue'
import { defineRouter } from '@etfm/vea-router'

export const AppContextKey = Symbol('AppContextKey')

export async function renderClient(opts: {
  rootElement: string
  pluginManager: any
  configManager: any
  config: any
  basename?: string
}) {
  let rootContainer = App

  const routes = opts.config?.router?.routes ?? []

  const router = defineRouter({ routes })

  for (const key of [
    'innerProvider',
    'i18nProvider',
    'accessProvider',
    'dataflowProvider',
    'outerProvider',
    'rootContainer'
  ]) {
    rootContainer = opts.pluginManager.applyPlugins({
      type: 'modify',
      key,
      initialValue: rootContainer,
      args: {}
    })
  }

  await opts.pluginManager.applyPlugins({
    type: 'event',
    key: 'onRouterCreated',
    args: {
      router
    }
  })

  const app = createApp(rootContainer)

  await opts.pluginManager.applyPlugins({
    type: 'event',
    key: 'onAppCreated',
    args: {
      app,
      router
    }
  })

  app.use(router)
  app.mount(opts.rootElement)

  // 注入appData 数据
  app.provide(AppContextKey, {
    pluginManager: opts.pluginManager,
    rootElement: opts.rootElement
  })

  opts.pluginManager.applyPlugins({
    type: 'event',
    key: 'onMounted',
    args: {
      app
    }
  })

  return {
    app
  }
}
