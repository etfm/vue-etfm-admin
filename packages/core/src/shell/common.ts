import { IPublicApiCommon, IPublicApiCommonSkeletonCabin } from '../types/api/common';
import { Skeleton as InnerSkeleton } from '../layout/skeleton';
import { Workbench as InnerWorkbench } from '../layout/layouts';
import { skeletonSymbol } from './symbols';
import { h } from 'vue';

export class Common implements IPublicApiCommon {
  private readonly __skeletonCabin: any;

  constructor(skeleton: InnerSkeleton) {
    this.__skeletonCabin = new SkeletonCabin(skeleton);
  }

  get skeletonCabin(): any {
    return this.__skeletonCabin;
  }
}

class SkeletonCabin implements IPublicApiCommonSkeletonCabin {
  private readonly [skeletonSymbol]: InnerSkeleton;

  constructor(skeleton: InnerSkeleton) {
    this[skeletonSymbol] = skeleton;
  }

  get Workbench(): any {
    const innerSkeleton = this[skeletonSymbol];
    return (props: any) =>
      h(InnerWorkbench, {
        ...props,
        skeleton: innerSkeleton,
      });
  }
}
