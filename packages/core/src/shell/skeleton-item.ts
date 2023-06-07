import { IWidget, Panel, PanelDock, Widget } from '../layout/widget';
import { IPublicModelSkeletonItem } from '../types/skeleton-item';
import { skeletonItemSymbol } from './symbols';

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: IWidget | Widget | Panel | PanelDock;

  constructor(skeletonItem: IWidget | Widget | Panel | PanelDock) {
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
