import type { App } from 'vue';
import type { Router } from 'vue-router';
import type { Pinia } from 'pinia';
import type { AnyFunction } from './tools';

export interface IRenderContext {
  rootElement?: App | Element | AnyFunction;
  rootContainer?: App | AnyFunction;
  onRouterCreated?: (opts?: { router: Router }) => void | Promise<void>;
  onPiniaCreated?: (opts?: { pinia: Pinia }) => void | Promise<void>;
  onAppCreated?: (opts?: { app: App; router: Router; pinia: Pinia }) => void | Promise<void>;
  onMounted?: (opts: { app: App; router: Router; pinia: Pinia }) => Promise<void> | void;
}
