import { lodash } from '@etfma/shared';
import type { Recordable } from '@etfma/types';

export function genMessage(langs: Record<string, Record<string, any>>, prefix = 'en') {
  const obj: Recordable<any> = {};

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default;
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = fileName.lastIndexOf('.');
    fileName = fileName.substring(0, lastIndex);
    const keyList = fileName.split('/');
    const moduleName = keyList.shift();
    const objKey = keyList.join('.');

    if (moduleName) {
      if (objKey) {
        lodash.set(obj, moduleName, obj[moduleName] || {});
        lodash.set(obj[moduleName], objKey, langFileModule);
      } else {
        lodash.set(obj, moduleName, langFileModule || {});
      }
    }
  });
  return obj;
}
