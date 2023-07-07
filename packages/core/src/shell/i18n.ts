import { I18n, IGlobalI18n, IPublicApiI18n } from '@etfma/types';
import { globalI18nSymbol } from './symbols';

export class GlobalI18n implements IPublicApiI18n {
  private readonly [globalI18nSymbol]: IGlobalI18n;

  constructor(i18n: IGlobalI18n) {
    this[globalI18nSymbol] = i18n;
  }

  get i18n(): I18n {
    return this[globalI18nSymbol].i18n;
  }

  changeLocale(locale: string): string {
    return this[globalI18nSymbol].changeLocale(locale);
  }
}
