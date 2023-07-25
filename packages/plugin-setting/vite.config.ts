import { definePackageUIConfig } from '@etfma/vite';
import ElementPlus from 'unplugin-element-plus/vite';

export default definePackageUIConfig({
  overrides: {
    plugins: [ElementPlus({})],
  },
});
