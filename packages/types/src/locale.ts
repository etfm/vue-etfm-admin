export type * from 'vue-i18n';

import type { I18nOptions } from 'vue-i18n';

export type I18nContext = I18nOptions & {
  locale: string;
};
