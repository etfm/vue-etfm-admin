import { skeleton } from 'etfm-engine';
import { eachTree, loggerWarning } from '@etfm/shared';
import { AppRouteModule, Recordable } from '@etfm/types';

let dynamicViewsModules: Record<string, () => Promise<Recordable<any>>>;

export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('/src/views/**/*.{vue,tsx}');

  eachTree(routeList, (route) => {
    const component = route.component as string;
    if (component && typeof component == 'string') {
      if (component.toUpperCase() == 'LAYOUT') {
        route.component = () => Promise.resolve(skeleton.Workbench);
      } else {
        route.component = dynamicImport(dynamicViewsModules, component);
      }

      route.meta ||= {};
    } else if (!component) {
      loggerWarning(`您没有配置${route?.name}的component属性，如果是有意为之，可以忽略此条警告`);
    }
  });

  return routeList as unknown as T[];
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable<any>>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('/src/views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });

  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];

    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    loggerWarning(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    loggerWarning(
      '在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!',
    );
    return;
  }
}
