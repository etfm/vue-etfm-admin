import { createApp } from 'vue'
import { register as registerRouter } from '@etfm/vea-router'
import { register as registerPinia } from '@etfm/vea-pinia'
import { lodash } from '@etfm/vea-shared'
import { context } from './register'
import type { PluginManager } from '@etfm/vea-plugin'

export const AppContextKey = Symbol('AppContextKey')

export async function initRender(opts: { pluginManager: PluginManager }) {
  const rootElement = lodash.isFunction(context.rootElement)
    ? await context.rootElement()
    : context.rootElement

  const rootContainer = lodash.isFunction(context.rootContainer)
    ? await context.rootContainer()
    : context.rootContainer

  const router = registerRouter()
  context.onRouterCreated && (await context.onRouterCreated({ router }))

  const pinia = registerPinia()
  context.onPiniaCreated && (await context.onPiniaCreated({ pinia }))

  const app = createApp(rootContainer)
  context.onAppCreated && (await context.onAppCreated({ app, router, pinia }))

  app.use(pinia)
  app.use(router)
  app.mount(rootElement as Element)

  // 注入appData 数据
  app.provide(AppContextKey, {
    pluginManager: opts.pluginManager,
    rootElement: rootElement
  })

  context.onMounted && (await context.onMounted({ app, router, pinia }))

  return {
    app,
    router,
    pinia
  }
}
