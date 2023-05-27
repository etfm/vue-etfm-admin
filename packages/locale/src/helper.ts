import { unref } from 'vue';
import { i18n, loadLocalePool } from './register';
import { loggerWarning } from '@etfma/shared';

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

  try {
    defaultLocal = (await import(`/src/locales/lang/${locale}.ts`))?.default;
  } catch (e) {
    loggerWarning(`没有找到${locale}文件， 请您查看文件是否存在`);
  }

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
