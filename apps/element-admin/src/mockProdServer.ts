// @ts-nocheck

import { createProdMockServer } from 'vite-plugin-mock/client';
import roleMock from '../mock/sys/menu';
import userMockFn from '../mock/sys/user';

export async function setupProdMockServer() {
  const mockModules = [...roleMock, ...userMockFn];
  createProdMockServer(mockModules);
}
