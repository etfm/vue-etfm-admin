import { IPublicTypePluginConfig } from './plugin-config';
import { IPublicModelPluginContext } from './plugin-context';

// eslint-disable-next-line max-len
export type IPublicTypePluginCreater = (
  ctx: IPublicModelPluginContext,
  options: any,
) => IPublicTypePluginConfig;
