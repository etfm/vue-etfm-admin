import { Component } from 'vue';

export interface IPublicApiCommon {
  get skeletonCabin(): IPublicApiCommonSkeletonCabin;
}
export interface IPublicApiCommonSkeletonCabin {
  /**
   * 编辑器框架 View
   * get Workbench Component
   */
  get Workbench(): Component;
}
