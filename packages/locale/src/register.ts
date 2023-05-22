import { getPluginManager } from '@etfma/plugin';
import { lodash } from '@etfma/shared';
import type { ILocalContext, I18n } from '@etfma/types';
import { initLocal } from './local';

export const loadLocalePool: string[] = [];

export const LOCALE = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export let context: ILocalContext = {
  locale: LOCALE.ZH_CN,
  fallback: LOCALE.ZH_CN,
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
};

export let local: I18n;

export async function register(opts?: ILocalContext) {
  // 收集配置信息
  const localConfig = getPluginManager().applyPlugins({
    key: 'local',
  });

  context = lodash.merge(context, opts, localConfig);

  //储存到本地多语言配置

  local = await initLocal();

  return local;
}
