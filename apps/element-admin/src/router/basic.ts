import { AppRouteRecordRaw } from '@etfm/types';
import { EXCEPTION_COMPONENT, LAYOUT, PAGE_NOT_FOUND_NAME } from './constant';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
    hideTab: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideTab: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: '/error-log',
  name: 'ErrorLog',
  component: LAYOUT,
  redirect: '/error-log/list',
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
    hideTab: true,
  },
  children: [
    {
      path: 'list',
      name: 'ErrorLogList',
      component: '/sys/error-log/index',
      meta: {
        title: '错误日志列表',
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
        hideTab: true,
      },
    },
  ],
};
