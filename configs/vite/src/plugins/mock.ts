/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 */

// @ts-nocheck
import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin({ enable, isBuild }: { enable: boolean; isBuild: boolean }) {
  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    localEnabled: enable && !isBuild,
    prodEnabled: enable && isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  });
}
