import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { config } from 'etfm-engine';
import { setCssVar } from './utils/theme';

const PluginElementUI: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const defaultOptios = {
        theme: true,
        i18n: true,
      };

      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(defaultOptios, context, options);

      config.onGot('theme', (color: string) => {
        // 初始化主题
        opts.theme && setCssVar({ color });
      });
    },
  };
};

PluginElementUI.pluginName = 'PluginElementUI';

export default PluginElementUI;
