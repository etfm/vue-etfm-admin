import { IPublicApiTheme, IPublicThemeOptins, IPublicTypeDisposable } from '@etfm/types';
import { Theme as InnerTheme, ThemeEvent } from '../theme';
import { editorSymbol, themeSymbol } from './symbols';
import { Editor } from '../editor';

export class Theme implements IPublicApiTheme {
  private readonly [themeSymbol]: InnerTheme;
  private readonly [editorSymbol]: Editor;

  constructor(editor: Editor, theme: InnerTheme) {
    this[themeSymbol] = theme;
    this[editorSymbol] = editor;
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

  changeTheme(color?: string, opts?: Partial<IPublicThemeOptins>) {
    this[themeSymbol].changeTheme(color, opts);
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

  onChange(fn: (data: any) => void): IPublicTypeDisposable {
    this[editorSymbol].eventBus.on(ThemeEvent.THEME_DAKE, fn);
    return () => this[editorSymbol].eventBus.off(ThemeEvent.THEME_DAKE, fn);
  }
}
