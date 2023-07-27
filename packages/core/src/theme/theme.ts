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
import { lodash } from '@etfma/shared';

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

  constructor() {
    this.setConfig({
      color: DEFAULT_PRIMARY_COLOR,
      mixDarkColor: DEFAULT_DARK,
      mixLightColor: DEFAULT_LIGHT,
      overrides: {},
      isDark: false,
    });

    engineConfig.onGot('theme', (options: ThemeOptins) => {
      this.setConfig({
        color: options.color || this.color,
        mixDarkColor: options.mixDarkColor || this.mixDarkColor,
        mixLightColor: options.mixDarkColor || this.mixLightColor,
        overrides: options.overrides || this.overrides,
        isDark: options.isDark || this.isDark,
      });

      this.setCssVar();
    });
  }

  setConfig(options: ThemeOptins) {
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
   * 切换主图颜色
   */
  changeTheme(color?: string) {
    const args = engineConfig.get('theme');

    engineConfig.set('theme', lodash.merge(args, { color }));
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

export const globalTheme = new Theme();
