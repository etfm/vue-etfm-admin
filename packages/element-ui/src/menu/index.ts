import basicMenu from './src/BasicMenu.vue';
import { withInstall } from '@etfm/shared';
import './index.scss';

export const BasicMenu = withInstall(basicMenu);
export default BasicMenu;

export * from './src/enum';
