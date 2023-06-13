export interface I18nData {
  type: 'i18n'
  intl?: any
  [key: string]: any
}

export interface I18nMap {
  [lang: string]: { [key: string]: string }
}
