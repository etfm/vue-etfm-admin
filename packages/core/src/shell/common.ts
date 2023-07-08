import { Skeleton as InnerSkeleton } from '../layout/skeleton';
import { Workbench as InnerWorkbench } from '../layout/layouts';
import { skeletonSymbol } from './symbols';
import { h } from 'vue';
import { IPublicApiCommon, IPublicApiCommonSkeletonCabin } from '@etfma/types';

export class Common implements IPublicApiCommon {
  private readonly __skeletonCabin: SkeletonCabin;

  constructor(skeleton: InnerSkeleton) {
    this.__skeletonCabin = new SkeletonCabin(skeleton);
  }

  get skeletonCabin(): SkeletonCabin {
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
