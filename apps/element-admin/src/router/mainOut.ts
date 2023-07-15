/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '@etfma/router';
// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    path: '/main-out',
    name: 'MainOut',
    component: '/demo/main-out/main-out',
    meta: {
      title: 'MainOut',
      ignoreAuth: true,
      hideMenu: true,
      hideTab: true,
    },
  },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
