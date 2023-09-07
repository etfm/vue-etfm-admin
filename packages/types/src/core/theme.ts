export interface IPublicTheme {
  theme: string;
  color: string;
  isDark: boolean;
  overrides: Record<string, any>;
  cssVar: Record<string, any>;
  change: (color?: string, opts?: Partial<IPublicThemeOptins>) => void;
  mix: (color1: string, color2: string, weight: number) => string;
}

export interface IPublicThemeOptins {
  theme: string;
  color: string;
  isDark: boolean;
  mixLightColor: string;
  mixDarkColor: string;
  overrides: Record<string, any>;
}
