import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { event, plugins } from 'etfm-engine';
import { PluginAsideMixedNav } from '@etfm/plugin-aside-mixed-nav';
import { PluginAsideNav } from '@etfm/plugin-aside-nav';
import { PluginHeaderNav } from '@etfm/plugin-header-nav';
import { PluginMixedNav } from '@etfm/plugin-mixed-nav';
import { PluginFullscreen } from '@etfm/plugin-fullscreen';
import { PluginTabs } from '@etfm/plugin-tabs';
import { PluginContentFullscreen } from '@etfm/plugin-content-fullscreen';
import { PluginElementUI } from '@etfm/plugin-element-ui';

const PluginElementPreset: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  const fn: any[] = [];
  return {
    init: async () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options);

      await plugins.register(PluginElementUI, { theme: opts.theme, i18n: opts.i18n });

      await plugins.register(PluginAsideMixedNav, {
        'unique-opened': opts?.uniqueOpened,
        title: opts?.title,
        image: opts?.image,
      });

      await plugins.register(PluginAsideNav, {
        'unique-opened': opts?.uniqueOpened,
        title: opts?.title,
        image: opts?.image,
      });

      await plugins.register(PluginHeaderNav, {
        'menu-trigger': opts?.menuTrigger,
        title: opts?.title,
        image: opts?.image,
      });

      await plugins.register(PluginMixedNav, {
        'unique-opened': opts?.uniqueOpened,
        title: opts?.title,
        image: opts?.image,
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

      const disposeLayoutPresetTitle = event.on('layout-preset:title', (arg) => {
        event.emit('aside-nav:title', arg);
        event.emit('header-nav:title', arg);
        event.emit('mixed-nav:title', arg);
        event.emit('side-mixed-nav:title', arg);
      });

      const disposeLayoutPresetImage = event.on('layout-preset:image', (arg) => {
        event.emit('aside-nav:image', arg);
        event.emit('header-nav:image', arg);
        event.emit('mixed-nav:image', arg);
        event.emit('side-mixed-nav:image', arg);
      });

      fn.push(disposeLayoutPresetUniqueOpened);
      fn.push(disposeLayoutPresetMenuTrigger);
      fn.push(disposeLayoutPresetTitle);
      fn.push(disposeLayoutPresetImage);
    },
    destroy() {
      fn.forEach((dispose) => dispose());
    },
  };
};

PluginElementPreset.pluginName = 'PluginElementPreset';

export default PluginElementPreset;

export { PluginElementPreset };

export * from '@etfm/plugin-aside-mixed-nav';
export * from '@etfm/plugin-header-nav';
export * from '@etfm/plugin-aside-nav';
export * from '@etfm/plugin-mixed-nav';
export * from '@etfm/plugin-fullscreen';
export * from '@etfm/plugin-tabs';
export * from '@etfm/plugin-content-fullscreen';
