import { Skeleton as InnerSkeleton } from '../layout/skeleton';
import { Workbench as InnerWorkbench } from '../layout/layouts';
import { editorSymbol, skeletonSymbol } from './symbols';
import { h } from 'vue';
import {
  IPublicApiCommon,
  IPublicApiCommonSkeletonCabin,
  IPublicApiI18n,
  IPublicApiRouter,
  IPublicApiTheme,
} from '@etfma/types';
import { globalI18n } from '../intl/i18n';
import { Editor } from '../editor';
import { globalRouter } from '../router/router';
import { globalTheme } from '../theme/theme';

export interface IPublicApiCommonUtils {}
class Utils implements IPublicApiCommonUtils {
  constructor(editor: Editor) {
    this[editorSymbol] = editor;
  }

  createIntl(): IPublicApiI18n {
    return globalI18n;
  }

  createRouter(): IPublicApiRouter {
    return globalRouter;
  }

  createTheme(): IPublicApiTheme {
    return globalTheme;
  }
}

export class Common implements IPublicApiCommon {
  private readonly __skeletonCabin: SkeletonCabin;
  private readonly __utils: Utils;

  constructor(editor: Editor, skeleton: InnerSkeleton) {
    this.__skeletonCabin = new SkeletonCabin(skeleton);
    this.__utils = new Utils(editor);
  }

  get skeletonCabin(): SkeletonCabin {
    return this.__skeletonCabin;
  }

  get utils() {
    return this.__utils;
  }
}

class SkeletonCabin implements IPublicApiCommonSkeletonCabin {
  private readonly [skeletonSymbol]: InnerSkeleton;

  constructor(skeleton: InnerSkeleton) {
    this[skeletonSymbol] = skeleton;
  }

  get Workbench(): any {
    const innerSkeleton = this[skeletonSymbol];
    return h(InnerWorkbench, {
      skeleton: innerSkeleton,
    });
  }
}
