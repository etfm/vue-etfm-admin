import { createI18n, type I18nOptions } from 'vue-i18n';
import { dynamicImport } from './helper';
import { context } from './register';
import type { Recordable } from '@etfma/types';

async function createI18nOptions(): Promise<I18nOptions> {
  const dynamicLocalesModules: Record<string, () => Promise<Recordable<any>>> = import.meta.glob(
    '/src/locales/*.ts',
  );

  const defaultLocal = dynamicImport(dynamicLocalesModules, context.locale);

  console.log(defaultLocal, '--------------------');

  const message = '';

  return {};
}

export async function initLocal() {
  const options = await createI18nOptions();
  const i18n = createI18n(options);
  return i18n;
}
