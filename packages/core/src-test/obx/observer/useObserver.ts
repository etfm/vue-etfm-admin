import { Tracker } from '../reactive';
import { getCurrentInstance, onBeforeUnmount } from 'vue';
import { IObserverOptions } from './types';

export const useObserver = (options?: IObserverOptions) => {
  const vm = getCurrentInstance();
  let tracker: Tracker | null = null;
  const disposeTracker = () => {
    if (tracker) {
      tracker.dispose();
      tracker = null;
    }
  };
  const vmUpdate = () => {
    vm?.proxy?.$forceUpdate();
  };

  onBeforeUnmount(disposeTracker);

  Object.defineProperty(vm, 'effect', {
    get() {
      // https://github.com/alibaba/formily/issues/2655
      return (vm as any)['_updateEffect'] || {};
    },
    set(newValue) {
      (vm as any)['_updateEffectRun'] = newValue.run;
      disposeTracker();
      const newTracker = () => {
        tracker = new Tracker(() => {
          if (options?.scheduler && typeof options.scheduler === 'function') {
            options.scheduler(vmUpdate);
          } else {
            vmUpdate();
          }
        });
      };

      const update = function () {
        let refn = null;
        tracker?.track(() => {
          refn = (vm as any)['_updateEffectRun'].call(newValue);
        });
        return refn;
      };
      newTracker();
      newValue.run = update;
      const vmtypes = vm as any;
      vmtypes['_updateEffect'] = newValue;
    },
  });
};
