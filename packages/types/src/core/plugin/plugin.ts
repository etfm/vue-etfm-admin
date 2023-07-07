/* eslint-disable max-len */

import { IPublicTypePluginCreater } from './plugin-creater';
import { IPublicTypePluginMeta } from './plugin-meta';

export interface IPublicPlugin extends IPublicTypePluginCreater {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}
