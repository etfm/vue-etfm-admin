import { createI18n } from 'vue-i18n';
import { setHtmlPageLang } from './helper';
import { unref } from 'vue';
import { I18n, IEditor, IGlobalI18n, I18nContext } from '@etfma/types';
import { engineConfig } from '../config';
import { lodash } from '@etfma/shared';

const loadLocalePool: string[] = [];

export const LOCALE = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export const INTL_OPTIONS = {
  locale: LOCALE.ZH_CN,
  fallbackLocale: LOCALE.ZH_CN,
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
  legacy: false,
  sync: true,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
};

export class GlobalI18n implements IGlobalI18n {
  private _opts: I18nContext;
  private _i18n: I18n;

  get locale() {
    return this._i18n.global.locale;
  }

  get i18n() {
    return this._i18n;
  }

  constructor(editor: IEditor) {
    this._opts = INTL_OPTIONS;

    engineConfig.onceGot('i18n').then((args: I18nContext) => {
      this._opts = lodash.merge(this._opts, args);

      this.init();
    });

    editor.onGot('locale', (args: any) => {
      const locale = this._opts.locale;

      this.setLanguageMessage(locale, args.message);
    });
  }

  init() {
    this.setLoadLocalePool(this._opts.locale);

    this._i18n = createI18n({
      ...this._opts,
    });
  }

  changeLocale(locale: string) {
    const globalI18n = this._i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    this.setI18nLanguage(locale);

    // 同步全部配置
    engineConfig.set('i18n', { locale });

    return locale;
  }

  setI18nLanguage(locale: string) {
    if (this._i18n.mode === 'legacy') {
      this._i18n.global.locale = locale;
    } else {
      (this._i18n.global.locale as any).value = locale;
    }

    setHtmlPageLang(locale);
  }

  setLanguageMessage(locale: string, message: any) {
    this._i18n.global.setLocaleMessage(locale, message);
    this.setLoadLocalePool(locale);
  }

  setLoadLocalePool(locale: string) {
    if (!loadLocalePool.includes(locale)) {
      loadLocalePool.push(locale);
    }
  }
}
