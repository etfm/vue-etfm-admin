import { App } from 'vue';
import { Router } from 'vue-router';
import { Pinia } from 'pinia';

export interface IRenderContext {
  rootElement?: App | Element | Function | Promise<Function>;
  rootContainer?: App | Function | Promise<Function>;
  onRouterCreated?: (opts?: { router: Router }) => void | Promise<void>;
  onPiniaCreated?: (opts?: { pinia: Pinia }) => void | Promise<void>;
  onAppCreated?: (opts?: { app: App; router: Router; pinia: Pinia }) => void | Promise<void>;
  onMounted?: (opts: { app: App; router: Router; pinia: Pinia }) => Promise<void> | void;
}
