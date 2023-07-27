import { ClassType } from '@etfma/types';
import {
  DEFAULT_PRIMARY_VAR,
  DEFAULT_LIGHT,
  DEFAULT_DARK,
  DEFAULT_PRIMARY_COLOR,
} from './constants';
import { mix } from './utils';

import { vueUse } from '@etfma/hooks';
import { engineConfig } from '../config';

interface IPublicTheme {
  color: string;
  isDark: boolean;
  changeTheme: ClassType;
}

interface ThemeOptins {
  color: string;
  isDark: boolean;
  mixLightColor: string;
  mixDarkColor: string;
  overrides: Record<string, any>;
}

export class Theme implements IPublicTheme {
  private _isDark: boolean = false;
  private _color: string;
  private mixLightColor;
  private mixDarkColor;

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

  constructor(options?: ThemeOptins) {
    this._color = options?.color || DEFAULT_PRIMARY_COLOR;
    this._isDark = options?.isDark || this._isDark;
    this.mixDarkColor = options?.mixDarkColor || DEFAULT_DARK;
    this.mixLightColor = options?.mixLightColor || DEFAULT_LIGHT;
    this.overrides = options?.overrides || {};

    engineConfig.onGot('theme', (options: ThemeOptins) => {
      for (const key in options) {
        this[key] = options[key];
      }

      this.setCssVar();
    });
  }

  /**
   * 切换主图颜色
   */
  changeTheme(color?: string) {
    engineConfig.set('theme', { color });
  }

  /**
   * 设置css变量
   */
  setCssVar() {
    vueUse.useCssVar(this.cssVar);
  }

  /**
   * 默认的主题颜色
   */
  defaultCssVar() {
    const defaujltPrimaryColors = {
      LIGHT: this.mixLightColor,
      DARK: this.mixDarkColor,
    };

    if (this.isDark) {
      defaujltPrimaryColors.LIGHT = this.mixDarkColor;
      defaujltPrimaryColors.DARK = this.mixLightColor;
    }
    const cssVar: Record<string, any> = {
      DEFAULT_PRIMARY_VAR: defaujltPrimaryColors.LIGHT,
      [`${DEFAULT_PRIMARY_VAR}-dark-2`]: mix(this.color, defaujltPrimaryColors.DARK, 0.2),
    };
    for (let i = 1; i < 10; i += 1) {
      cssVar[`${DEFAULT_PRIMARY_VAR}-light-${i}`] = mix(
        this.color,
        defaujltPrimaryColors.LIGHT,
        i * 0.1,
      );
    }

    return defaujltPrimaryColors;
  }
}
