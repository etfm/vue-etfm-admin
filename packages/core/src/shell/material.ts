import type {
  AssetsKey,
  IPublicApiMaterial,
  IPublicModelEditor,
  IPublicTypeDisposable,
} from '@etfma/types';
import { editorSymbol } from './symbols';

export class Material implements IPublicApiMaterial {
  constructor(editor: IPublicModelEditor) {
    this[editorSymbol] = editor;
  }

  /**
   * 设置「资产包」结构
   * @param assets
   * @returns
   */
  async setAssets(key: AssetsKey, assets: any) {
    return await this[editorSymbol].setAssets(key, assets);
  }

  /**
   * 获取「资产包」结构
   * @returns
   */
  getAssets(key: AssetsKey): any | undefined {
    return this[editorSymbol].get(key);
  }

  /**
   * 监听 assets 变化的事件
   * @param fn
   */
  onChangeAssets(key: AssetsKey, fn: (...args) => void): IPublicTypeDisposable {
    const dispose = [
      // 设置 assets，经过 setAssets 赋值
      this[editorSymbol].onGot(key, fn),
    ];

    return () => {
      dispose.forEach((d) => d && d());
    };
  }
}
