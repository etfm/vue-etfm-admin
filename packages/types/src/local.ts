export type * from 'vue-i18n';

export interface ILocalContext {
  locale: string;
  fallback: string;
  availableLocales: string[];
}
