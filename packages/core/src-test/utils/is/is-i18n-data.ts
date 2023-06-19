import { I18nData } from '../../types/i18n';

export function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}
