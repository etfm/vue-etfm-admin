export type TranslatePair = {
  [key: string]: string | string[] | TranslatePair;
};

export type Language = {
  locale: string;
  message: TranslatePair;
};
