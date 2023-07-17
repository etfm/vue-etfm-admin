import { IPublicTypePluginConfig } from './plugin-config';
import { IPublicPluginContext } from './plugin-context';

export interface IPublicPluginOptions {
  visible?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export type IPublicTypePluginCreater = (
  ctx: IPublicPluginContext,
  options: IPublicPluginOptions,
) => IPublicTypePluginConfig;
