import type { ExtractPropTypes, Ref } from 'vue';
import { mutable, type NavigationFailure, type RouteLocationRaw } from '@etfma/types';
import { definePropType, lodash, buildProps } from '@etfma/shared';

export interface MenuItemRegistered {
  index: string;
  indexPath: string[];
  active: boolean;
}
export interface MenuItemClicked {
  index: string;
  indexPath: string[];
  route?: RouteLocationRaw;
}

export interface MenuProvider {
  openedMenus: string[];
  items: Record<string, MenuItemRegistered>;
  subMenus: Record<string, MenuItemRegistered>;
  activeIndex?: string;
  isMenuPopup: boolean;
  props: MenuProps;
  ns: any;

  addMenuItem: (item: MenuItemRegistered) => void;
  removeMenuItem: (item: MenuItemRegistered) => void;
  addSubMenu: (item: MenuItemRegistered) => void;
  removeSubMenu: (item: MenuItemRegistered) => void;

  openMenu: (index: string, indexPath: string[]) => void;
  closeMenu: (index: string, indexPath: string[]) => void;

  handleMenuItemClick: (item: MenuItemClicked) => void;
  handleSubMenuClick: (subMenu: MenuItemRegistered) => void;
}

export interface SubMenuProvider {
  addSubMenu: (item: MenuItemRegistered) => void;
  removeSubMenu: (item: MenuItemRegistered) => void;
  handleMouseleave?: (deepDispatch: boolean) => void;
  mouseInChild: Ref<boolean>;
  level: number;
}

export const menuProps = buildProps({
  mode: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'vertical',
  },
  defaultActive: {
    type: String,
    default: '',
  },
  defaultOpeneds: {
    type: definePropType<string[]>(Array),
    default: () => mutable([] as const),
  },
  uniqueOpened: Boolean,
  router: Boolean,
  menuTrigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'hover',
  },
  collapse: Boolean,
  backgroundColor: String,
  textColor: String,
  activeTextColor: String,
  collapseTransition: {
    type: Boolean,
    default: true,
  },
  ellipsis: {
    type: Boolean,
    default: true,
  },
  popperEffect: {
    type: String,
    values: ['dark', 'light'],
    default: 'dark',
  },
} as const);
export type MenuProps = ExtractPropTypes<typeof menuProps>;

const checkIndexPath = (indexPath: unknown): indexPath is string[] =>
  Array.isArray(indexPath) && indexPath.every((path) => lodash.isString(path));

export const menuEmits = {
  close: (index: string, indexPath: string[]) =>
    lodash.isString(index) && checkIndexPath(indexPath),

  open: (index: string, indexPath: string[]) => lodash.isString(index) && checkIndexPath(indexPath),

  select: (
    index: string,
    indexPath: string[],
    item: MenuItemClicked,
    routerResult?: Promise<void | NavigationFailure>,
  ) =>
    lodash.isString(index) &&
    checkIndexPath(indexPath) &&
    lodash.isObject(item) &&
    (routerResult === undefined || routerResult instanceof Promise),
};
export type MenuEmits = typeof menuEmits;
