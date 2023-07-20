import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-ignore: type unless
import DefineOptions from 'unplugin-vue-define-options/vite';
import { type UserConfig } from 'vite';

const commonConfig: UserConfig = {
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
  },
  plugins: [vue(), vueJsx(), DefineOptions()],
};

export { commonConfig };
