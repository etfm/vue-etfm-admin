import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { config, theme } from 'etfm-engine';
import { setCssVar } from './theme';

const PluginElementUI: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const defaultOptios = {
        theme: true,
        i18n: true,
      };

      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(defaultOptios, context, options);

      config.onGot('theme.color', (color: string) => {
        opts.theme && setCssVar({ color });
      });

      config.onGot('theme.isDark', (e) => {
        opts.theme && setCssVar({ color: theme.color, isDark: e });
      });
    },
  };
};

PluginElementUI.pluginName = 'PluginElementUI';

export default PluginElementUI;

export { PluginElementUI };
