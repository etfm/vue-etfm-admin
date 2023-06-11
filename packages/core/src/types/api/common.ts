import { Component } from 'vue';

export interface IPublicApiCommon {
  get utils(): IPublicApiCommonUtils;

  get skeletonCabin(): IPublicApiCommonSkeletonCabin;
}
export interface IPublicApiCommonSkeletonCabin {
  /**
   * 编辑器框架 View
   * get Workbench Component
   */
  get Workbench(): Component;
}

export interface IPublicApiCommonUtils {
  /**
   * i18n 相关工具
   * i18n tools
   *
   * @param {(string | object)} instance
   * @returns {{
   *     intlNode(id: string, params?: object): ReactNode;
   *     intl(id: string, params?: object): string;
   *     getLocale(): string;
   *     setLocale(locale: string): void;
   *   }}
   * @since v1.0.17
   */
  createIntl(instance: string | object): {
    intl(id: string, params?: object): string;
    getLocale(): string;
    setLocale(locale: string): void;
  };
}
