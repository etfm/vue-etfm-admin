import { getPluginManager } from '@etfma/plugin';
import { lodash, loggerWarning } from '@etfma/shared';
import type { ILocalContext, I18n } from '@etfma/types';
import { initLocale } from './locale';
import type { App } from 'vue';

export const loadLocalePool: string[] = [];

export const LOCALE = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export let context: ILocalContext = {
  locale: LOCALE.ZH_CN,
  fallbackLocale: LOCALE.ZH_CN,
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
  legacy: false,
  sync: true,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
};

export let i18n: I18n;

export async function register(app: App, opts?: ILocalContext) {
  if ((app as App & { __VUE_I18N__: any }).__VUE_I18N__) {
    loggerWarning('VUE_I18N已注册，插件默认执行覆盖');
  }

  // 收集配置信息
  const localConfig = getPluginManager().applyPlugins({
    key: 'local',
  });

  context = lodash.merge(context, opts, localConfig);

  i18n = await initLocale();

  app.use(i18n);

  return i18n;
}
