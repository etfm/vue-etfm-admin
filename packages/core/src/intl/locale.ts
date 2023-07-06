import { createI18n } from 'vue-i18n';
import { setHtmlPageLang } from './helper';
import { App, unref } from 'vue';
import { I18n, IEditor, ILocalContext } from '@etfma/types';
import { engineConfig } from '../config';
import { lodash, loggerWarning } from '@etfma/shared';

const loadLocalePool: string[] = [];

export const LOCALE = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

const INTL_OPTIONS = {
  locale: LOCALE.ZH_CN,
  fallbackLocale: LOCALE.ZH_CN,
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
  legacy: false,
  sync: true,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
};

export class GlobalLocal {
  private _app: App;
  private _opts: ILocalContext;
  private _i18n: I18n;

  get locale() {
    return this._i18n.global.locale;
  }

  get i18n() {
    return this._i18n;
  }

  constructor(app: App, editor: IEditor) {
    this._app = app;
    this._opts = INTL_OPTIONS;
    this.init();

    engineConfig.onGot('i18n', (args: ILocalContext) => {
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

    if ((this._app as App & { __VUE_I18N__: any }).__VUE_I18N__) {
      loggerWarning('VUE_I18N已注册，插件默认执行覆盖');
    }

    this._app.use(this._i18n);
  }

  changeLocale(locale: string) {
    const globalI18n = this._i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (loadLocalePool.includes(locale)) {
      this.setI18nLanguage(locale);
      return locale;
    }

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
