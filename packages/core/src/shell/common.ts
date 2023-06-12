import {
  IPublicApiCommon,
  IPublicApiCommonSkeletonCabin,
  IPublicApiCommonUtils,
} from '../types/api/common';
import { createIntl as innerCreateIntl } from '../intl';
import { Skeleton as InnerSkeleton } from '../layout/skeleton';
import { Workbench as InnerWorkbench } from '../layout/layouts';
import { skeletonSymbol } from './symbols';
import { h } from 'vue';

export class Common implements IPublicApiCommon {
  private readonly __skeletonCabin: any;
  private readonly __utils: Utils;

  constructor(skeleton: InnerSkeleton) {
    this.__skeletonCabin = new SkeletonCabin(skeleton);
    this.__utils = new Utils();
  }

  get utils(): any {
    return this.__utils;
  }

  get skeletonCabin(): any {
    return this.__skeletonCabin;
  }
}

class Utils implements IPublicApiCommonUtils {
  createIntl(instance: string | object): {
    intl(id: string, params?: object): string;
    getLocale(): string;
    setLocale(locale: string): void;
  } {
    return innerCreateIntl(instance);
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
