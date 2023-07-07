import { I18nContext } from '../locale';
import { RouterContext } from '../router';

export interface IPublicTypeEngineOptions {
  /**
   * 多语言配置
   * @default
   */
  i18n?: I18nContext;

  /**
   * 开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项
   * enable strict plugin mode, default value: false
   * under strict mode, customed engineOption is not accepted.
   */
  enableStrictPluginMode?: boolean;

  /**
   * 路由配置
   * @default
   */
  router?: RouterContext;
}
