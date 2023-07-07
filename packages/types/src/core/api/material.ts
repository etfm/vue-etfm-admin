import { IPublicTypeDisposable } from '../disposable';
import { AssetsKey } from '../material';

export interface IPublicApiMaterial {
  /**
   * 设置「资产」结构
   * set data for Assets
   * @returns void
   */
  setAssets(key: AssetsKey, assets: any): void;

  /**
   * 获取「资产包」结构
   * get AssetsJson data
   * @returns IPublicTypeAssetsJson
   */
  getAssets(key: AssetsKey): any | undefined;

  /**
   * 监听 assets 变化的事件
   * add callback for assets changed event
   * @param key
   * @param fn
   */
  onChangeAssets(key: AssetsKey, fn: (...args) => void): IPublicTypeDisposable;
}
