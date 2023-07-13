import Dropdown from './src/dropdown.vue';
import DropdownItem from './src/dropdown-item.vue';
import DropdownMenu from './src/dropdown-menu.vue';
import { withInstall, withNoopInstall } from '@etfma/shared';

export const EtfmaDropdown = withInstall(Dropdown, {
  DropdownItem,
  DropdownMenu,
});
export default EtfmaDropdown;
export const EtfmaDropdownItem = withNoopInstall(DropdownItem);
export const EtfmaDropdownMenu = withNoopInstall(DropdownMenu);
export * from './src/dropdown';
export * from './src/instance';
export * from './src/tokens';
