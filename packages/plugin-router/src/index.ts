import type { IPublicPluginContext, IPublicTypePlugin } from '@etfma/types';

const PluginRouter: IPublicTypePlugin = (ctx: IPublicPluginContext) => {
  return {
    init: () => {
      console.log(ctx.preference.getPreferenceValue('PluginRouter'), ctx.global.get('app'));
    },
  };
};

PluginRouter.pluginName = 'PluginRouter';

export default PluginRouter;
