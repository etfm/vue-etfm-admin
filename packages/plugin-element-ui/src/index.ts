import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { config, theme } from 'etfm-engine';
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
        if (opts.theme) {
          theme.theme === 'light' ? setCssVar({ color }) : setCssVarDark({ color: color });
        }
      });

      config.onGot('theme.isDark', (e) => {
        opts.theme && setCssVar({ isDark: e });
      });

      config.onGot('theme', (e) => {
        opts.theme && setCssVarDark({ theme: e });
      });

      config.onGot('layout', (e: LayoutType) => {
        opts.layout && setCssVarDark({}, e);
      });
    },
  };
};

PluginElementUI.pluginName = 'PluginElementUI';

export default PluginElementUI;

export { PluginElementUI };
