export interface IPublicApiTheme {
  get isDark(): boolean;

  get color(): string;

  changeTheme: (color: string) => void;
}
