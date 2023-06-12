export { addDynamicRoute } from './convention';

export { register, router } from './register';

export * from './usePage';

export type { IRouterContext, AppRouteRecordRaw, AppRouteModule } from '@etfma/types';

export * from 'vue-router';

export const RouterPlugin = (ctx: any) => {
  return {
    init() {},
  };
};
