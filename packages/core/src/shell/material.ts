import { IPublicModelEditor, IPublicTypeDisposable } from '@etfma/types';
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
  async setAssets(assets: IPublicTypeAssetsJson) {
    return await this[editorSymbol].setAssets(assets);
  }

  /**
   * 获取「资产包」结构
   * @returns
   */
  getAssets(): IPublicTypeAssetsJson | undefined {
    return this[editorSymbol].get('assets');
  }

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson) {
    return this[designerSymbol].loadIncrementalAssets(incrementalAssets);
  }

  /**
   * 监听 assets 变化的事件
   * @param fn
   */
  onChangeAssets(fn: () => void): IPublicTypeDisposable {
    const dispose = [
      // 设置 assets，经过 setAssets 赋值
      this[editorSymbol].onGot('assets', fn),
      // 增量设置 assets，经过 loadIncrementalAssets 赋值
      this[editorSymbol].eventBus.on('designer.incrementalAssetsReady', fn),
    ];

    return () => {
      dispose.forEach((d) => d && d());
    };
  }
}
