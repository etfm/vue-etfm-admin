import { I18n, IPublicApiI18n } from '@etfm/types';
import { GlobalI18n } from '../intl/i18n';
import { editorSymbol, intlSymbol } from './symbols';
import { Editor } from '../editor';

export class Intl implements IPublicApiI18n {
  private readonly [intlSymbol]: GlobalI18n;

  constructor(editor: Editor, i18n: GlobalI18n) {
    this[intlSymbol] = i18n;
    this[editorSymbol] = editor;
  }

  get i18n(): I18n<{}, {}, {}, string, boolean> {
    return this[intlSymbol].i18n;
  }

  changeLocale(locale: string): string {
    return this[intlSymbol].changeLocale(locale);
  }
}
