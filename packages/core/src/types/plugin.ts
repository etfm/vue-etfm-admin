/* eslint-disable max-len */

import { IPublicTypePluginCreater } from './plugin-creater';
import { IPublicTypePluginMeta } from './plugin-meta';

export interface IPublicTypePlugin extends IPublicTypePluginCreater {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}
