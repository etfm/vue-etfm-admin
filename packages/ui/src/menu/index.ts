import { withInstall, withNoopInstall } from '@etfma/shared';

import Menu from './src/menu.vue';
import MenuItem from './src/menu-item.vue';
import MenuItemGroup from './src/menu-item-group.vue';
import SubMenu from './src/sub-menu';

export const EtfmaMenu = withInstall(Menu, {
  MenuItem,
  MenuItemGroup,
  SubMenu,
});
export default EtfmaMenu;
export const EtfmaMenuItem = withNoopInstall(MenuItem);
export const EtfmaMenuItemGroup = withNoopInstall(MenuItemGroup);
export const EtfmaSubMenu = withNoopInstall(SubMenu);

export * from './src/menu.vue';
export * from './src/menu-item';
export * from './src/menu-item-group';
export * from './src/sub-menu';
export * from './src/types';
