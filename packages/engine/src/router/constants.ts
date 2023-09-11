import { skeleton } from '../core';
import Redirect from './redirect';

export const REDIRECT_NAME = 'Redirect';

export const ROUTER_OPTIONS = {
  historyType: 'hash',
  basename: '/',
  routes: [],
};

export const DEFAULT_REDIRECT = {
  path: '/redirect',
  component: () => Promise.resolve(skeleton.Workbench),
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
    hideTab: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)',
      name: REDIRECT_NAME,
      component: () => Promise.resolve(Redirect),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
        hideTab: true,
      },
    },
  ],
};
