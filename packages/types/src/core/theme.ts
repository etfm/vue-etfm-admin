export interface IPublicTheme {
  color: string;
  isDark: boolean;
  changeTheme: (color?: string) => void;
  mix: (color1: string, color2: string, weight: number) => string;
}

export interface IPublicThemeOptins {
  color: string;
  isDark: boolean;
  mixLightColor: string;
  mixDarkColor: string;
  overrides: Record<string, any>;
}
