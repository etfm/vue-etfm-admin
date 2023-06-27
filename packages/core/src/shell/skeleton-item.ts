import { IPublicModelSkeletonItem, IWidget } from '@etfma/types';
import { Widget } from '../layout/widget';
import { skeletonItemSymbol } from './symbols';

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: IWidget | Widget;

  constructor(skeletonItem: IWidget | Widget) {
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
