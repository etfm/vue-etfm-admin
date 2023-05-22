import { createI18n, type I18nOptions } from 'vue-i18n';

async function createI18nOptions(): Promise<I18nOptions> {
  import.meta.glob('/src/locales/*.ts');

  return {};
}

export async function initLocal() {
  const options = await createI18nOptions();
  const i18n = createI18n(options);
  return i18n;
}
