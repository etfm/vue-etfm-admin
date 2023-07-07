export interface IPublicTypePluginMeta {
  /**
   * define dependencies which the plugin depends on
   */
  dependencies?: string | string[];
  /**
   * specify which engine version is compatible with the plugin
   */
  engines?: {
    /** e.g. '^1.0.0' */
    version?: string;
  };

  /**
   * use 'common' as event prefix when eventPrefix is not set.
   * strongly recommend using pluginName as eventPrefix
   *
   * eg.
   *   case 1, when eventPrefix is not specified
   *        event.emit('someEventName') is actually sending event with name 'common:someEventName'
   *
   *   case 2, when eventPrefix is 'myEvent'
   *        event.emit('someEventName') is actually sending event with name 'myEvent:someEventName'
   */
  eventPrefix?: string;
}
