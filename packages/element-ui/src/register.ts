import { getPluginManager } from '@etfma/plugin'
import { lodash } from '@etfma/shared'
export interface IContext {}

export let context = {}

export function register(opts?: IContext) {
  // 收集配置信息
  const element = getPluginManager().applyPlugins({
    key: 'element'
  })

  context = lodash.merge(context, opts, element)
}
