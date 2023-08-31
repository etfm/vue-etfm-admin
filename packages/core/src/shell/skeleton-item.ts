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

  get area() {
    return this[skeletonItemSymbol].area;
  }

  hide() {
    this[skeletonItemSymbol].hide();
  }

  show() {
    this[skeletonItemSymbol].show();
  }

  toggle() {
    this[skeletonItemSymbol].toggle();
  }
}
