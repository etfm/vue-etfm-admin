import App from './App.vue'
import { createApp } from 'vue'
import { register as registerRouter } from '@etfm/vea-router'
import { register as registerPinia } from '@etfm/vea-pinia'
import { createPluginManager } from '@etfm/vea-plugin'

export const AppContextKey = Symbol('AppContextKey')

export async function render() {
  const pluginManager = await createPluginManager()
  const rootElement = document.getElementById('app')

  let rootContainer = App

  rootContainer = await pluginManager.applyPlugins({
    key: 'render',
    args: {}
  })

  const router = registerRouter()
  await pluginManager.applyPlugins({
    key: 'onRouterCreated',
    args: {
      router
    }
  })

  const pinia = registerPinia()
  await pluginManager.applyPlugins({
    key: 'onPiniaCreated',
    args: {
      pinia
    }
  })

  const app = createApp(rootContainer)
  await pluginManager.applyPlugins({
    key: 'onAppCreated',
    args: {
      app,
      router,
      pinia
    }
  })

  app.use(pinia)
  app.use(router)
  app.mount('#app')

  // 注入appData 数据
  app.provide(AppContextKey, {
    pluginManager: pluginManager,
    rootElement: rootElement
  })

  await pluginManager.applyPlugins({
    key: 'onMounted',
    args: {
      app,
      router,
      pinia
    }
  })

  return {
    app,
    router,
    pinia
  }
}

render()
