import type { App } from 'vue';
import type { Router } from 'vue-router';
import type { Pinia } from 'pinia';
import type { AnyFunction } from './tools';
import type { I18n } from 'vue-i18n';

export interface IRenderContext {
  rootElement?: App | Element | AnyFunction;
  rootContainer?: App | AnyFunction;
  onRouterCreated?: (opts?: { router: Router }) => void | Promise<void>;
  onPiniaCreated?: (opts?: { pinia: Pinia }) => void | Promise<void>;
  onLocaleCreated?: (opts?: { locale: I18n }) => void | Promise<void>;
  onAppCreated?: (opts?: { app: App }) => void | Promise<void>;
  onMounted?: (opts: {
    app: App;
    router: Router;
    pinia: Pinia;
    locale: I18n;
  }) => Promise<void> | void;
}
