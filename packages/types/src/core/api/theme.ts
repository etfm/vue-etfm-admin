export interface IPublicApiTheme {
  get theme(): string;
  get isDark(): boolean;
  get color(): string;
  get overrides(): Record<string, any>;
  change: (color?: string) => void;
  mix: (color1: string, color2: string, weight: number) => string;
  toggle: () => void;
  setCssVar: (overrides: Record<string, any>) => void;
}
