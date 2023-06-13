import type { DefineComponent } from 'vue';

export interface IPublicTypeEngineOptions {
  /**
   * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
   * when this is true, node that configured as conditional not renderring
   * will not display in canvas.
   * @default false
   */
  enableCondition?: boolean;

  /**
   * 语言，默认值：'zh-CN'
   * @default 'zh-CN'
   */
  locale?: string;

  /**
   * 开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项
   * enable strict plugin mode, default value: false
   * under strict mode, customed engineOption is not accepted.
   */
  enableStrictPluginMode?: boolean;

  /**
   * 自定义 loading 组件
   */
  loadingComponent?: DefineComponent;

  /**
   * 设置所有属性支持变量配置，默认值：false
   */
  supportVariableGlobally?: boolean;
}
