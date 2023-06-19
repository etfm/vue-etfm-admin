import collectData from './collectData';
import { IObserverOptions } from './types';
import { useObserver } from './useObserver';

export function observer(baseComponent: any, options?: IObserverOptions) {
  const name = options?.name || baseComponent.name || 'ObservableComponent';

  return {
    name,
    ...baseComponent,
    setup(props: Record<string, any>, context: any) {
      useObserver(options);
      return baseComponent?.setup?.(props, context);
    },
  };
}

export { collectData, useObserver };

export type { IObserverOptions };
