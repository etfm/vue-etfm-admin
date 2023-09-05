import { withInstall, withNoopInstall } from '@etfm/shared';

import Breadcrumb from './src/breadcrumb.vue';
import BreadcrumbItem from './src/breadcrumb-item.vue';

export const EtfmaBreadcrumb = withInstall(Breadcrumb, {
  BreadcrumbItem,
});
export const EtfmaBreadcrumbItem = withNoopInstall(BreadcrumbItem);
export default EtfmaBreadcrumb;

export * from './src/breadcrumb';
export * from './src/breadcrumb-item';
export * from './src/constants';
export type { BreadcrumbInstance, BreadcrumbItemInstance } from './src/instances';
