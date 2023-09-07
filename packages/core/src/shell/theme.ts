import { IPublicApiTheme } from '@etfm/types';
import { Theme as InnerTheme } from '../theme';
import { editorSymbol, themeSymbol } from './symbols';
import { Editor } from '../editor';

export class Theme implements IPublicApiTheme {
  private readonly [themeSymbol]: InnerTheme;

  constructor(editor: Editor, theme: InnerTheme) {
    this[themeSymbol] = theme;
    this[editorSymbol] = editor;
  }

  get theme(): string {
    return this[themeSymbol].theme;
  }

  get isDark(): boolean {
    return this[themeSymbol].isDark;
  }

  get color(): string {
    return this[themeSymbol].color;
  }

  get overrides(): Record<string, any> {
    return this[themeSymbol].overrides;
  }

  get cssVar(): Record<string, any> {
    return this[themeSymbol].cssVar;
  }

  change(color?: string) {
    this[themeSymbol].change(color);
  }

  setCssVar(overrides: Record<string, any>) {
    this[themeSymbol].setCssVar(overrides);
  }

  mix(color1: string, color2: string, weight: number) {
    return this[themeSymbol].mix(color1, color2, weight);
  }

  toggle() {
    this[themeSymbol].toggle();
  }
}
