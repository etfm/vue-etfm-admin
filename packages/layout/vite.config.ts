import { definePackageConfig } from '@etfma/vite';

export default definePackageConfig({
  overrides: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@etfma/design/shared";`,
        },
      },
    },
  },
});
