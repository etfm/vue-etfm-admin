export type * from 'vue-i18n';

import type { I18nOptions } from 'vue-i18n';

export type ILocalContext = I18nOptions & {
  locale: string;
};
