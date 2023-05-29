import { unref } from 'vue';
import { i18n, loadLocalePool } from './register';
import { loggerWarning } from '@etfma/shared';

/**
 * 动态获取多语言配置文件
 * @param locale
 */
export function getDynamicImportLocale(locale: string) {
  const dynamicLocalesModules: Record<string, any> = import.meta.glob('/src/locales/lang/*.ts', {
    eager: true,
  });

  const defaultLocal = dynamicImport(dynamicLocalesModules, locale);

  return defaultLocal.default;
}

/**
 * 匹配多语言文件
 * @param dynamicLocalesModules
 * @param locale
 * @param folder
 */
export function dynamicImport(
  dynamicLocalesModules: Record<string, any>,
  locale: string,
  folder: string = 'locales/lang',
) {
  const keys = Object.keys(dynamicLocalesModules);

  const matchKeys = keys.filter((key) => {
    const k = key.replace(`/src/${folder}/`, '');

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
    loggerWarning(`在src/${folder}下找不到${locale}.ts, 请自行创建!`);
    return;
  }
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

/**
 * 切换语言
 * 1.切换语言动态获取语言
 * @param locale
 * @returns
 */
export async function changeLocale(locale: string) {
  const globalI18n = i18n.global;
  const currentLocale = unref(globalI18n.locale);
  if (currentLocale === locale) {
    return locale;
  }

  if (loadLocalePool.includes(locale)) {
    setI18nLanguage(locale);
    return locale;
  }

  await setLanguageMessage(locale);
  return locale;
}

export function getLocale() {
  return i18n.global.locale;
}

/**
 * 动态设置语言
 * @param locale
 */
export async function setLanguageMessage(locale: string) {
  const message = await getLanguageMessage(locale);
  i18n.global.setLocaleMessage(locale, message);
  setLoadLocalePool(locale);
  setI18nLanguage(locale);
}

/**
 * 获取语言
 * @param locale
 */
export async function getLanguageMessage(locale: string) {
  // TODO 可能用户自己设置路径，或者自己设置语言
  let defaultLocal = {
    locale,
    message: {},
  };

  defaultLocal = getDynamicImportLocale(locale);

  const message = defaultLocal.message ?? {};
  return message;
}

/**
 * 优化配置
 * 储存已导入的语言，将不再setI18nLanguage
 * @param locale
 */
export function setLoadLocalePool(locale: string) {
  if (!loadLocalePool.includes(locale)) {
    loadLocalePool.push(locale);
  }
}
