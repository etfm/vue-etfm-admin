import type { FunctionalComponent } from 'vue';
import type { Recordable, RouteLocation } from '@etfm/types';

export interface DefaultContext {
  Component: FunctionalComponent & { type: Recordable<any> };
  route: RouteLocation;
}

export function getTransitionName({
  route,
  openCache,
  cacheTabs,
  enableTransition,
  defaultTransitionName,
}: Pick<DefaultContext, 'route'> & {
  enableTransition: boolean;
  openCache: boolean;
  defaultTransitionName: string;
  cacheTabs: string[];
}): string | undefined {
  if (!enableTransition) {
    return undefined;
  }

  const isInCache = cacheTabs.includes(route.name as string);
  const transitionName = 'fade-slide';
  let name: string | undefined = transitionName;

  if (openCache) {
    name = isInCache && route.meta.loaded ? transitionName : undefined;
  }
  return name || (route.meta.transitionName as string) || defaultTransitionName;
}
