import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-ignore: type unless
import DefineOptions from 'unplugin-vue-define-options/vite';
import { type UserConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import { presetTypography, presetUno } from 'unocss';

const commonConfig: UserConfig = {
  server: {
    host: true,
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
  },
  plugins: [
    vue(),
    vueJsx(),
    DefineOptions(),
    UnoCSS({
      exclude: ['node_modules'],
      include: ['**.ts', '**.tsx', '**.vue'],
      presets: [presetUno(), presetTypography()],
    }),
  ],
};

export { commonConfig };
