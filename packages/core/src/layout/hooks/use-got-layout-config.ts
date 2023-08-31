import { IPublicLayout } from '@etfma/types';
import { engineConfig } from '../../config';

export function useGotLayoutConfig(model: IPublicLayout) {
  engineConfig.onGot('layout', (arg) => {
    model.layout = arg;
  });

  engineConfig.onGot('layout.isMobile', (arg) => {
    model.isMobile = arg;
  });

  engineConfig.onGot('layout.zIndex', (arg) => {
    model.zIndex = arg;
  });

  engineConfig.onGot('layout.headerVisible', (arg) => {
    model.headerVisible = arg;
  });

  engineConfig.onGot('layout.headerHeight', (arg) => {
    model.headerHeight = arg;
  });

  engineConfig.onGot('layout.headerFixed', (arg) => {
    model.headerFixed = arg;
  });

  engineConfig.onGot('layout.headerBackgroundColor', (arg) => {
    model.headerBackgroundColor = arg;
  });

  engineConfig.onGot('layout.sideVisible', (arg) => {
    model.sideVisible = arg;
  });

  engineConfig.onGot('layout.sideWidth', (arg) => {
    model.sideWidth = arg;
  });

  engineConfig.onGot('layout.sideMixedWidth', (arg) => {
    model.sideMixedWidth = arg;
  });

  engineConfig.onGot('layout.sideBackgroundColor', (arg) => {
    model.sideBackgroundColor = arg;
  });

  engineConfig.onGot('layout.sideCollapse', (arg) => {
    model.sideCollapse = arg;
  });

  engineConfig.onGot('layout.sideCollapseWidth', (arg) => {
    model.sideCollapseWidth = arg;
  });

  engineConfig.onGot('layout.contentPadding', (arg) => {
    model.contentPadding = arg;
  });

  engineConfig.onGot('layout.contentPaddingBottom', (arg) => {
    model.contentPaddingBottom = arg;
  });

  engineConfig.onGot('layout.contentPaddingTop', (arg) => {
    model.contentPaddingTop = arg;
  });

  engineConfig.onGot('layout.contentPaddingLeft', (arg) => {
    model.contentPaddingLeft = arg;
  });

  engineConfig.onGot('layout.contentPaddingRight', (arg) => {
    model.contentPaddingRight = arg;
  });

  engineConfig.onGot('layout.contentBackgroundColor', (arg) => {
    model.contentBackgroundColor = arg;
  });

  engineConfig.onGot('layout.footerVisible', (arg) => {
    model.footerVisible = arg;
  });

  engineConfig.onGot('layout.footerHeight', (arg) => {
    model.footerHeight = arg;
  });

  engineConfig.onGot('layout.footerFixed', (arg) => {
    model.footerFixed = arg;
  });

  engineConfig.onGot('layout.tabVisible', (arg) => {
    model.tabVisible = arg;
  });

  engineConfig.onGot('layout.tabHeight', (arg) => {
    model.tabHeight = arg;
  });

  engineConfig.onGot('layout.tabBackgroundColor', (arg) => {
    model.tabBackgroundColor = arg;
  });

  engineConfig.onGot('layout.mixedExtraVisible', (arg) => {
    model.mixedExtraVisible = arg;
  });

  engineConfig.onGot('layout.fixedMixedExtra', (arg) => {
    model.fixedMixedExtra = arg;
  });
}
