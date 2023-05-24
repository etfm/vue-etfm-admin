import { createI18n, type I18nOptions } from 'vue-i18n';
import { getMessages } from './helper';
import { context } from './register';

async function createI18nOptions(): Promise<I18nOptions> {
  const dynamicLocalesModules: Record<string, any> = import.meta.glob('/src/locales/lang/*.ts', {
    eager: true,
  });

  const messages = getMessages(dynamicLocalesModules);

  return {
    messages,
    ...context,
  };
}

export async function initLocale() {
  const options = await createI18nOptions();
  const i18n = createI18n(options);
  return i18n;
}
