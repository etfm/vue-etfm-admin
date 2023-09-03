import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { event, plugins } from '@etfma/core';
import { PluginAsideMixedNav } from '@etfm/plugin-aside-mixed-nav';
import { PluginAsideNav } from '@etfm/plugin-aside-nav';
import { PluginHeaderNav } from '@etfm/plugin-header-nav';
import { PluginMixedNav } from '@etfm/plugin-mixed-nav';
import { PluginFullscreen } from '@etfm/plugin-fullscreen';
import { PluginTabs } from '@etfm/plugin-tabs';
import { PluginContentFullscreen } from '@etfm/plugin-content-fullscreen';

const PluginLayoutPreset: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  const fn: any[] = [];
  return {
    init: async () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options);

      await plugins.register(PluginAsideMixedNav, {
        'unique-opened': opts?.uniqueOpened,
      });

      await plugins.register(PluginAsideNav, {
        'unique-opened': opts?.uniqueOpened,
      });

      await plugins.register(PluginHeaderNav, {
        'menu-trigger': opts?.menuTrigger,
      });

      await plugins.register(PluginMixedNav, {
        'unique-opened': opts?.uniqueOpened,
      });

      await plugins.register(PluginFullscreen);

      await plugins.register(PluginTabs);

      await plugins.register(PluginContentFullscreen);

      const disposeLayoutPresetUniqueOpened = event.on('layout-preset:unique-opened', (arg) => {
        event.emit('aside-nav:unique-opened', arg);
        event.emit('side-mixed-nav:unique-opened', arg);
        event.emit('mixed-nav:unique-opened', arg);
      });

      const disposeLayoutPresetMenuTrigger = event.on('layout-preset:menu-trigger', (arg) => {
        event.emit('header-nav:menu-trigger', arg);
      });

      fn.push(disposeLayoutPresetUniqueOpened);
      fn.push(disposeLayoutPresetMenuTrigger);
    },
    destroy() {
      fn.forEach((dispose) => dispose());
    },
  };
};

PluginLayoutPreset.pluginName = 'PluginLayoutPreset';

export default PluginLayoutPreset;

export { PluginLayoutPreset };

export * from '@etfm/plugin-aside-mixed-nav';
export * from '@etfm/plugin-header-nav';
export * from '@etfm/plugin-aside-nav';
export * from '@etfm/plugin-mixed-nav';
export * from '@etfm/plugin-fullscreen';
export * from '@etfm/plugin-tabs';
export * from '@etfm/plugin-content-fullscreen';
