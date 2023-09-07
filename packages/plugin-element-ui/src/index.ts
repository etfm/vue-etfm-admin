import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { config } from 'etfm-engine';
import { setCssVar, setCssVarDark } from './theme';

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
        opts.theme && setCssVar({ isDark: e });
      });

      config.onGot('theme', (e) => {
        opts.theme && setCssVarDark({ theme: e });
      });

      config.onGot('layout', () => {});
    },
  };
};

PluginElementUI.pluginName = 'PluginElementUI';

export default PluginElementUI;

export { PluginElementUI };
