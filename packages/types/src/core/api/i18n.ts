import { I18n } from 'vue-i18n';

export interface IPublicApiI18n {
  get i18n(): I18n;

  changeLocale(locale: string): string;
}
