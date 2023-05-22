import { getPluginManager } from '@etfma/plugin';
import { lodash } from '@etfma/shared';
import type { ILocalContext, I18n } from '@etfma/types';
import { initLocal } from './local';

export let context: ILocalContext = {};

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
