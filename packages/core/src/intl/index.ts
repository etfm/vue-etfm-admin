import { IntlMessageFormat } from 'intl-messageformat';
import { globalLocale } from './global-locale';
import { I18nData } from '../types/i18n';

function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}

function generateTryLocales(locale: string) {
  const tries = [locale, locale.replace('-', '_')];
  if (locale === 'zh-TW' || locale === 'en-US') {
    tries.push('zh-CN');
    tries.push('zh_CN');
  } else {
    tries.push('en-US');
    tries.push('en_US');
    if (locale !== 'zh-CN') {
      tries.push('zh-CN');
      tries.push('zh_CN');
    }
  }
  return tries;
}

function injectVars(msg: string, params: any, locale: string): string {
  if (!msg || !params) {
    return msg;
  }
  const formater = new IntlMessageFormat(msg, locale);

  return formater.format(params as any) as string;
  /*

  return template.replace(/({\w+})/g, (_, $1) => {
    const key = (/\d+/.exec($1) || [])[0] as any;
    if (key && params[key] != null) {
      return params[key];
    }
    return $1;
  }); */
}

export function intl(data: any, params?: object) {
  if (!isI18nData(data)) {
    return data;
  }
  if (data.intl) {
    return data.intl;
  }
  const locale = globalLocale.getLocale();
  const tries = generateTryLocales(locale);
  let msg: string | undefined;
  for (const lan of tries) {
    msg = data[lan];
    if (msg != null) {
      break;
    }
  }
  if (msg == null) {
    return `##intl@${locale}##`;
  }
  return injectVars(msg, params, locale);
}

export function shallowIntl(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  const maps: any = {};
  Object.keys(data).forEach((key) => {
    maps[key] = intl(data[key]);
  });
  return maps;
}

export function createIntl(instance: string | object): {
  intl(id: string, params?: object): string;
  getLocale(): string;
  setLocale(locale: string): void;
} {
  // TODO: make reactive
  const data = (() => {
    const locale = globalLocale.getLocale();
    if (typeof instance === 'string') {
      if ((window as any)[instance]) {
        return (window as any)[instance][locale] || {};
      }
      const key = `${instance}_${locale.toLocaleLowerCase()}`;
      return (window as any)[key] || {};
    }
    if (instance && typeof instance === 'object') {
      return (instance as any)[locale] || {};
    }
    return {};
  })();

  function intl(key: string, params?: object): string {
    // TODO: tries lost language
    const str = data[key];

    if (str == null) {
      return `##intl@${key}##`;
    }

    return injectVars(str, params, globalLocale.getLocale());
  }

  return {
    intl,
    getLocale() {
      return globalLocale.getLocale();
    },
    setLocale(locale: string) {
      globalLocale.setLocale(locale);
    },
  };
}

export { globalLocale };
