import { IPublicThemeOptins } from '@etfm/types';
import { config, theme } from 'etfm-engine';

const DEFAULT_PRIMARY_VAR = '--el-color-primary';
const DEFAULT_LIGHT = '#ffffff';
const DEFAULT_DARK = '#141414';

/**
 * 设置主题
 * @param options
 */
export function setCssVar(options: Partial<IPublicThemeOptins>) {
  const color = options.color ?? theme.color;
  const isDark = options.isDark ?? theme.isDark;

  const defaujltPrimaryColors = {
    LIGHT: DEFAULT_LIGHT,
    DARK: DEFAULT_DARK,
  };

  // 暗黑主题
  if (isDark) {
    defaujltPrimaryColors.LIGHT = DEFAULT_DARK;
    defaujltPrimaryColors.DARK = DEFAULT_LIGHT;
  }

  const cssVar = {
    [DEFAULT_PRIMARY_VAR]: color,
    [`${DEFAULT_PRIMARY_VAR}-dark-2`]: theme.mix(color, defaujltPrimaryColors.DARK, 0.2),
  };

  for (let i = 1; i < 10; i += 1) {
    cssVar[`${DEFAULT_PRIMARY_VAR}-light-${i}`] = theme.mix(
      color,
      defaujltPrimaryColors.LIGHT,
      i * 0.1,
    );
  }

  theme.setCssVar(cssVar);
}

/**
 * 设置深色主题
 * @param options
 */
export function setCssVarDark(options: Partial<IPublicThemeOptins>) {
  const isDark = options.isDark ?? theme.isDark;
  const tm = options.theme ?? theme.theme;

  const cssVar = {};

  if (!isDark && tm === 'dark') {
    config.set('layout.sideBackgroundColor', '#001529');
    cssVar['--el-menu-item-bg-color'] = '#0c2135';
    cssVar['--el-menu-active-color'] = '#fff';
    cssVar['--el-menu-hover-bg-color'] = '#0960bd';
    cssVar['--el-menu-hover-text-color'] = '#fff';
    cssVar['--el-menu-text-color'] = '#ffffffb3';
  }
}
