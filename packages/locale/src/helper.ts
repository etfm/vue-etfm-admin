import { lodash, loggerWarning } from '@etfma/shared';
import { i18n } from './register';
import type { Recordable } from '@etfma/types';

export function getMessages(langs: Record<string, Record<string, any>>) {
  const obj: Recordable<any> = {};
  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default;
    const moduleName = langFileModule.locale;
    const moduleMessage = langFileModule.message;

    if (moduleName) {
      lodash.set(obj, moduleName, moduleMessage);
    } else {
      loggerWarning(`在${key}文件中locale配置不能为空， 请您正确配置locale属性`);
    }
  });
  return obj;
}

export function setHtmlPageLang(locale: string) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function setI18nLanguage(locale: string) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
  setHtmlPageLang(locale);
}

export async function changeLocale(locale: string) {
  const globalI18n = i18n.global;
  const currentLocale = globalI18n.locale;
  if (currentLocale === locale) {
    return locale;
  }

  setI18nLanguage(locale);
  return locale;
}

export function getLocale() {
  return i18n.global.locale;
}
