import type { Recordable } from '@etfma/types';
import { loggerWarning } from '@etfma/shared';
import { loadLocalePool } from './register';

export function dynamicImport(
  dynamicLocalesModules: Record<string, () => Promise<Recordable<any>>>,
  locale: string,
  folder: string = 'locales',
) {
  const keys = Object.keys(dynamicLocalesModules);

  const matchKeys = keys.filter((key) => {
    const k = key.replace(`/src/${folder}`, '');

    const lastIndex = k?.lastIndexOf('.');

    return k?.substring(0, lastIndex) === locale;
  });

  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];

    return dynamicLocalesModules[matchKey];
  } else if (matchKeys?.length > 1) {
    loggerWarning(
      'Please do not create `.ts` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    loggerWarning(`在src/locales/下找不到${locale}.ts, 请自行创建!`);
    return;
  }
}

export function setHtmlPageLang(locale: string) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function setLoadLocalePool(cb: (loadLocalePool: string[]) => void) {
  cb(loadLocalePool);
}
