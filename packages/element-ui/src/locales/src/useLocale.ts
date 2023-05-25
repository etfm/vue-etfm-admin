import type { Language, MaybeRef } from '@etfma/types';
import { Ref, computed, isRef, ref, unref } from 'vue';
import { lodash } from '@etfma/shared';
import { useConfigProviderContext } from '../../config-provider';
import ZhCN from '../lang/zh-cn';

export type TranslatorOption = Record<string, string | number>;
export type Translator = (path: string, option?: TranslatorOption) => string;
export type LocaleContext = {
  locale: Ref<Language>;
  lang: Ref<string>;
  t: Translator;
};

export const buildTranslator =
  (locale: MaybeRef<Language>): Translator =>
  (path, option) =>
    translate(path, option, unref(locale));

export const translate = (
  path: string,
  option: undefined | TranslatorOption,
  locale: Language,
): string =>
  (lodash.get(locale, path, path) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`,
  );

export const buildLocaleContext = (locale: MaybeRef<Language>): LocaleContext => {
  const lang = computed(() => unref(locale).locale);
  const localeRef = isRef(locale) ? locale : ref(locale);
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale),
  };
};

export const useLocale = (localeOverrides?: Ref<Language | undefined>) => {
  const context = useConfigProviderContext();
  const locale = localeOverrides || context.mergedLocaleRef;
  return buildLocaleContext(computed(() => locale.value || ZhCN));
};
