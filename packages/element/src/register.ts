import { getPluginManager } from '@etfm/vea-plugin'
import { lodash } from '@etfm/vea-shared'
export interface IContext {}

export let context = {}

export function register(opts?: IContext) {
  // 收集配置信息
  const element = getPluginManager().applyPlugins({
    key: 'element'
  })

  context = lodash.merge(context, opts, element)
}
