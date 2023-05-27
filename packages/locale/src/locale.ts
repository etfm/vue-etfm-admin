import { createI18n, type I18nOptions } from 'vue-i18n';
import { context } from './register';
import { getLanguageMessage, setLoadLocalePool } from './helper';

async function createI18nOptions(): Promise<I18nOptions> {
  const locale = context.locale;
  const message = await getLanguageMessage(locale);
  setLoadLocalePool(locale);

  return {
    messages: {
      [locale]: message,
    },
    ...context,
  };
}

export async function initLocale() {
  const options = await createI18nOptions();

  const i18n = createI18n(options);

  return i18n;
}
