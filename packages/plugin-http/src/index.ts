import { IHttpContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { register } from './register';

const PluginHttp: IPublicPlugin = (ctx: IPublicPluginContext, options: IHttpContext) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IHttpContext;

      register(config, options);
    },
  };
};

PluginHttp.pluginName = 'PluginHttp';

export default PluginHttp;

export { register, http } from './register';
export * from 'axios';
export * from './enum';
export * from './ErrorThrow';
export * from './Axios';
export * from './axiosCancel';
export * from './axiosRetry';

export type {
  IErrorThrow,
  IHttpContext,
  Result,
  UploadFileParams,
  IRequestInterceptorTuple,
  IResponseInterceptorTuple,
  IResultField,
  RequestConfig,
} from '@etfma/types';
