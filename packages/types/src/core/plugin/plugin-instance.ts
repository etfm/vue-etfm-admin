import { IPublicTypePluginMeta } from './plugin-meta';

export interface IPublicModelPluginInstance {
  /**
   * 是否 disable
   * current plugin instance is disabled or not
   */
  disabled: boolean;

  inited: boolean;

  /**
   * 插件名称
   * plugin name
   */
  get pluginName(): string;

  /**
   * 依赖信息，依赖的其他插件
   * depenency info
   */
  get dep(): string[];

  /**
   * 插件配置元数据
   * meta info of this plugin
   */
  get meta(): IPublicTypePluginMeta;

  /**
   * 销毁插件
   */
  dispose(): void;

  /**
   * 初始化插件
   */
  init(forceInit?: boolean): void;
}
