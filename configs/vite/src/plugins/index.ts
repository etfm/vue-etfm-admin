// @ts-nocheck
import type { PluginOption } from 'vite';
import purgeIcons from 'vite-plugin-purge-icons';

import { createAppConfigPlugin } from './appConfig';
import { configCompressPlugin } from './compress';
import { configHtmlPlugin } from './html';
import { configMockPlugin } from './mock';
import { configSvgIconsPlugin } from './svgSprite';
import { configVisualizerConfig } from './visualizer';
import ElementPlus from 'unplugin-element-plus/dist/vite';

interface Options {
  isBuild: boolean;
  root: string;
  compress: string;
  enableMock?: boolean;
  enableAnalyze?: boolean;
}

async function createPlugins({ isBuild, root, enableMock, compress, enableAnalyze }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  const appConfigPlugin = await createAppConfigPlugin({ root, isBuild });
  vitePlugins.push(appConfigPlugin);

  vitePlugins.push(ElementPlus({}));
  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin({ isBuild }));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin({ isBuild }));

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons());

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin({
        compress,
      }),
    );
  }

  // rollup-plugin-visualizer
  if (enableAnalyze) {
    vitePlugins.push(configVisualizerConfig());
  }

  // vite-plugin-mock
  vitePlugins.push(configMockPlugin({ enable: !!enableMock, isBuild }));

  return vitePlugins;
}

export { createPlugins };
