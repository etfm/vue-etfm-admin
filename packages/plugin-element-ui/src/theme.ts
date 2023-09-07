import { IPublicThemeOptins } from '@etfm/types';
import { theme } from 'etfm-engine';

const DEFAULT_PRIMARY_VAR = '--el-color-primary';
const DEFAULT_LIGHT = '#ffffff';
const DEFAULT_DARK = '#141414';
const DEFAULT_PRIMARY_COLOR = '#409eff';

/**
 * 设置主题
 * @param options
 */
export function setCssVar(options: Partial<IPublicThemeOptins>) {
  const color = options.color || DEFAULT_PRIMARY_COLOR;

  const isDark = options.isDark || theme.isDark;

  const defaujltPrimaryColors = {
    LIGHT: DEFAULT_LIGHT,
    DARK: DEFAULT_DARK,
  };

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
