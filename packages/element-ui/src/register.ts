import { getPluginManager } from '@etfma/plugin';
import { lodash } from '@etfma/shared';
export interface IContext {}

export let context = {};

export function register(opts?: IContext) {
  // 收集配置信息
  const element = getPluginManager().applyPlugins({
    key: 'element',
  });

  // 设置多语言

  context = lodash.merge(context, opts, element);
}
