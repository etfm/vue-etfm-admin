import type { AppRouteRecordRaw } from '@etfm/vea-router'

interface IRouter {
  routes: AppRouteRecordRaw[]
}
interface ConfigType {
  router?: IRouter
}
/**
 * 通过方法的方式配置umi，能带来更好的 typescript 体验
 * @param  {ConfigType} config
 * @returns ConfigType
 */
export function defineConfig(config: ConfigType): ConfigType {
  return config
}
