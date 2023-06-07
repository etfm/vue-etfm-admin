import { IPublicTypeDisposable } from '../disposable';

export interface IPublicApiMaterial {
  /**
   * 设置「资产包」结构
   * set data for Assets
   * @returns void
   */
  setAssets(assets: any): void;

  /**
   * 获取「资产包」结构
   * get AssetsJson data
   * @returns IPublicTypeAssetsJson
   */
  getAssets(): any | undefined;

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * load Assets incrementally, and will merge this with exiting assets
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: any): void;

  /**
   * 监听 assets 变化的事件
   * add callback for assets changed event
   * @param fn
   */
  onChangeAssets(fn: () => void): IPublicTypeDisposable;
}
