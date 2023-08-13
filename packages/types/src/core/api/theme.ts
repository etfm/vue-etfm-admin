import { IPublicThemeOptins } from '../theme';

export interface IPublicApiTheme {
  get isDark(): boolean;
  get color(): string;
  get overrides(): Record<string, any>;
  changeTheme: (color?: string, opts?: Partial<IPublicThemeOptins>) => void;
  mix: (color1: string, color2: string, weight: number) => string;
  toggle: () => void;
  onChange: (fn: any) => void;
  setCssVar: (overrides: Record<string, any>) => void;
}
