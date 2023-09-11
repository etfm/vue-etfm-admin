import { I18n, IPublicApiI18n } from '@etfm/types';
import { GlobalI18n } from '../i18n/i18n';
import { intlSymbol } from './symbols';

export class Intl implements IPublicApiI18n {
  private readonly [intlSymbol]: GlobalI18n;

  constructor(i18n: GlobalI18n) {
    this[intlSymbol] = i18n;
  }

  get i18n(): I18n<{}, {}, {}, string, boolean> {
    return this[intlSymbol].i18n;
  }

  changeLocale(locale: string): string {
    return this[intlSymbol].changeLocale(locale);
  }
}
