import { definePropType, lodash, buildProps } from '@etfm/shared';
import { NavigationFailure, mutable } from '@etfm/types';
import { MenuItemClicked } from './types';

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
