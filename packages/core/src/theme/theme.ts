import { IEditor, IPublicTheme, IPublicThemeOptins } from '@etfma/types';
import {
  DEFAULT_PRIMARY_VAR,
  DEFAULT_LIGHT,
  DEFAULT_DARK,
  DEFAULT_PRIMARY_COLOR,
} from './constants';

import { vueUse } from '@etfma/hooks';
import { engineConfig } from '../config';
import { lodash } from '@etfma/shared';
import { editor } from '../editor';

export enum ThemeEvent {
  THEME_DAKE = 'theme.dark',
}

export class Theme implements IPublicTheme {
  private _isDark: boolean = false;
  private _color: string;
  private mixLightColor;
  private mixDarkColor;
  private readonly editor: IEditor;

  private overrides;

  get isDark() {
    return this._isDark;
  }

  get color() {
    return this._color;
  }

  get cssVar() {
    const defaultCssVar = this.defaultCssVar();

    return {
      ...defaultCssVar,
      ...this.overrides,
    };
  }

  constructor(editor: IEditor) {
    this.editor = editor;
    const isDark = vueUse.useDark();

    this.setConfig({
      color: DEFAULT_PRIMARY_COLOR,
      mixDarkColor: DEFAULT_DARK,
      mixLightColor: DEFAULT_LIGHT,
      overrides: {},
      isDark: isDark.value,
    });

    engineConfig.onGot('theme', (options: IPublicThemeOptins) => {
      this.setConfig({
        color: options?.color ?? this.color,
        mixDarkColor: options?.mixDarkColor ?? this.mixDarkColor,
        mixLightColor: options?.mixDarkColor ?? this.mixLightColor,
        overrides: options?.overrides ?? this.overrides,
        isDark: options?.isDark ?? this.isDark,
      });

      this.setCssVar();
    });
  }

  setConfig(options: IPublicThemeOptins) {
    this._color = options.color;
    this.mixDarkColor = options.mixDarkColor;
    this.mixLightColor = options.mixLightColor;
    this.overrides = options.overrides;
    this._isDark = options.isDark;
  }

  /**
   * 初始化主题
   */
  init() {
    this.setCssVar();
  }

  /**
   * 主题切换
   */
  toggle() {
    this._isDark = !this.isDark;

    engineConfig.set('theme', { isDark: this._isDark });

    this.editor.emit(ThemeEvent.THEME_DAKE, this._isDark);
  }

  /**
   * 切换主图颜色
   */
  changeTheme(color?: string, opts?: Partial<IPublicThemeOptins>) {
    const args = engineConfig.get('theme');

    engineConfig.set('theme', lodash.merge(args, { ...opts, color }));
  }

  /**
   * 设置css变量
   */
  setCssVar(overrides?: Record<string, any>) {
    overrides && (this.overrides = overrides);
    document.documentElement.className = this.isDark ? 'dark' : '';

    for (const key in this.cssVar) {
      if (Object.prototype.hasOwnProperty.call(this.cssVar, key)) {
        document.documentElement.style.setProperty(key, this.cssVar[key]);
      }
    }
  }

  /**
   * 默认的主题颜色
   */
  defaultCssVar() {
    const aa = '--el-color-primary';
    const defaujltPrimaryColors = {
      LIGHT: this.mixLightColor,
      DARK: this.mixDarkColor,
    };

    if (this.isDark) {
      defaujltPrimaryColors.LIGHT = this.mixDarkColor;
      defaujltPrimaryColors.DARK = this.mixLightColor;
    }
    const cssVar: Record<string, any> = {
      [DEFAULT_PRIMARY_VAR]: this.color,
      [aa]: this.color,
      [`${DEFAULT_PRIMARY_VAR}-dark-2`]: this.mix(this.color, defaujltPrimaryColors.DARK, 0.2),
      [`${aa}-dark-2`]: this.mix(this.color, defaujltPrimaryColors.DARK, 0.2),
    };
    for (let i = 1; i < 10; i += 1) {
      cssVar[`${DEFAULT_PRIMARY_VAR}-light-${i}`] = this.mix(
        this.color,
        defaujltPrimaryColors.LIGHT,
        i * 0.1,
      );
      cssVar[`${aa}-light-${i}`] = this.mix(this.color, defaujltPrimaryColors.LIGHT, i * 0.1);
    }

    return cssVar;
  }

  mix(color1: string, color2: string, weight: number) {
    weight = Math.max(Math.min(Number(weight), 1), 0);
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    const r = Math.round(r1 * (1 - weight) + r2 * weight);
    const g = Math.round(g1 * (1 - weight) + g2 * weight);
    const b = Math.round(b1 * (1 - weight) + b2 * weight);
    const _r = ('0' + (r || 0).toString(16)).slice(-2);
    const _g = ('0' + (g || 0).toString(16)).slice(-2);
    const _b = ('0' + (b || 0).toString(16)).slice(-2);
    return '#' + _r + _g + _b;
  }
}

export const globalTheme = new Theme(editor);
