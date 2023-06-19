import { IPublicModelSkeletonItem, IWidget } from '@etfma/types';
import { Panel, Widget } from '../layout/widget';
import { skeletonItemSymbol } from './symbols';

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: IWidget | Widget | Panel;

  constructor(skeletonItem: IWidget | Widget | Panel) {
    this[skeletonItemSymbol] = skeletonItem;
  }

  get name() {
    return this[skeletonItemSymbol].name;
  }

  disable() {
    this[skeletonItemSymbol].disable?.();
  }

  enable() {
    this[skeletonItemSymbol].enable?.();
  }

  hide() {
    this[skeletonItemSymbol].hide();
  }

  show() {
    this[skeletonItemSymbol].show();
  }
}
