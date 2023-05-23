import { CreateAppFunction, createApp } from 'vue';
import { register as registerRouter } from '@etfma/router';
import { register as registerPinia } from '@etfma/pinia';
import { lodash } from '@etfma/shared';
import { context } from './register';
import type { PluginManager } from '@etfma/plugin';
import { register as registerHttp } from '@etfma/http';
import { register as registerLocale } from '@etfma/locale';

export const AppContextKey = Symbol('AppContextKey');

export async function initRender(opts: { pluginManager: PluginManager }) {
  const rootElement = lodash.isFunction(context.rootElement)
    ? await context.rootElement()
    : context.rootElement;

  const rootContainer = lodash.isFunction(context.rootContainer)
    ? await context.rootContainer()
    : context.rootContainer;

  /**
   * 注册http
   */
  await registerHttp();

  /**
   * 注册路由
   */
  const router = registerRouter();
  context.onRouterCreated && (await context.onRouterCreated({ router }));

  /**
   * 注册状态管理
   */
  const pinia = registerPinia();
  context.onPiniaCreated && (await context.onPiniaCreated({ pinia }));

  /**
   * 注册多语言
   */
  const locale = await registerLocale();
  context.onLocaleCreated && (await context.onLocaleCreated({ locale }));

  /**
   * 创建app实例
   */
  const app = createApp(rootContainer as unknown as CreateAppFunction<Element>);
  context.onAppCreated && (await context.onAppCreated({ app, router, pinia, locale }));

  app.use(pinia);
  app.use(router);
  app.use(locale);
  app.mount(rootElement as Element);

  /**
   * 全局换共享
   */
  app.provide(AppContextKey, {
    pluginManager: opts.pluginManager,
    rootElement: rootElement,
  });

  /**
   * app初始化完毕
   */
  context.onMounted && (await context.onMounted({ app, router, pinia, locale }));

  return {
    app,
    router,
    pinia,
    locale,
  };
}
