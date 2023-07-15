import { AppRouteModule } from '@etfma/core';
import { LAYOUT } from '../constant';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: 'Dashboard',
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: '/dashboard/analysis/analysis',
      meta: {
        affix: true,
        title: '分析页',
      },
    },
  ],
};

export default dashboard;
