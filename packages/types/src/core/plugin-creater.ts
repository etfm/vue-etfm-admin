import { IPublicTypePluginConfig } from './plugin-config';
import { IPublicModelPluginContext } from './plugin-context';

export type IPublicTypePluginCreater = (
  ctx: IPublicModelPluginContext,
  options: any,
) => IPublicTypePluginConfig;
