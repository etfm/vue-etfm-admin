// https://github.com/mobxjs/mobx-vue/blob/master/src/collectData.ts

import { isObservable } from '../reactive';

export default function collectData(vm: any, data?: any) {
  const dataDefinition = typeof data === 'function' ? data.call(vm, vm) : data || {};
  const filteredData = Object.keys(dataDefinition).reduce((result: any, field) => {
    const value = dataDefinition[field];

    if (isObservable(value)) {
      Object.defineProperty(vm, field, {
        configurable: true,
        get() {
          return value;
        },
        set() {},
      });
    } else {
      result[field] = value;
    }

    return result;
  }, {});

  return filteredData;
}
