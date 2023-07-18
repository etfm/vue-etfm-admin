import { IPublicTypePluginConfig } from './plugin-config';
import { IPublicPluginContext } from './plugin-context';

export type IPublicTypePluginCreater = (
  ctx: IPublicPluginContext,
  options: any,
) => IPublicTypePluginConfig;
