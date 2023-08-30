import { I18nContext } from '../locale';
import { RouterContext } from '../router';
import { IPublicThemeOptins } from './theme';

export interface IPublicTypeEngineOptions {
  /**
   * 布局配置
   * @default {}
   */
  layout?: IPublicLayout;
  /**
   * 主题配置
   * @default
   */
  theme?: IPublicThemeOptins;
  /**
   * 多语言配置
   * @default
   */
  i18n?: I18nContext;

  /**
   * 开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项
   * enable strict plugin mode, default value: false
   * under strict mode, customed engineOption is not accepted.
   */
  // enableStrictPluginMode?: boolean;

  /**
   * 路由配置
   * @default
   */
  router?: RouterContext;
}

export type IPluginTypeConfig = keyof IPublicTypeEngineOptions;

export type LayoutType =
  | 'side-nav'
  | 'header-nav'
  | 'mixed-nav'
  | 'side-mixed-nav'
  | 'full-content';

export interface IPublicLayout {
  /**
   * 布局方式
   * side-nav 侧边菜单布局
   * header-nav 顶部菜单布局
   * mixed-nav 侧边&顶部菜单布局
   * side-mixed-nav 侧边混合菜单布局
   * full-content 全屏内容布局
   * @default side-nav
   */
  layout?: LayoutType;
  /**
   * 是否移动端显示
   * @default false
   */
  isMobile?: boolean;
  /**
   * zIndex
   * @default 100
   */
  zIndex?: number;
  /**
   * header是否显示
   * @default true
   */
  headerVisible?: boolean;
  /**
   * header高度
   * @default 48
   */
  headerHeight?: number;
  /**
   * header是否固定在顶部
   * @default true
   */
  headerFixed?: boolean;
  /**
   * 背景颜色
   * @default #fff
   */
  headerBackgroundColor?: string;
  /**
   * 侧边栏是否可见
   * @default true
   */
  sideVisible?: boolean;
  /**
   * 侧边栏宽度
   * @default 180
   */
  sideWidth?: number;
  /**
   * 混合侧边栏宽度
   * @default 80
   */
  sideMixedWidth?: number;
  /**
   * 侧边栏背景颜色
   * @default #fff
   */
  sideBackgroundColor?: string;
  /**
   * 侧边菜单折叠状态
   * @default false
   */
  sideCollapse?: boolean;
  /**
   *  侧边菜单折叠宽度
   * @default 48
   */
  sideCollapseWidth?: number;
  /**
   * padding
   * @default 16
   */
  contentPadding?: number;
  /**
   * paddingBottom
   * @default 16
   */
  contentPaddingBottom?: number;
  /**
   * paddingTop
   * @default 16
   */
  contentPaddingTop?: number;
  /**
   * paddingLeft
   * @default 16
   */
  contentPaddingLeft?: number;
  /**
   * paddingRight
   * @default 16
   */
  contentPaddingRight?: number;
  /**
   * content背景颜色
   * @default #fff
   */
  contentBackgroundColor?: string;
  /**
   * footer 是否可见
   * @default false
   */
  footerVisible?: boolean;
  /**
   * footer 高度
   * @default 32
   */
  footerHeight?: number;
  /**
   * footer 是否固定
   * @default true
   */
  footerFixed?: boolean;
  /**
   * footer背景颜色
   * @default #fff
   */
  footerBackgroundColor?: string;
  /**
   * tab是否可见
   * @default true
   */
  tabVisible?: boolean;
  /**
   * tab高度
   * @default 30
   */
  tabHeight?: number;
  /**
   * footer背景颜色
   * @default #fff
   */
  tabBackgroundColor?: string;
  /**
   * breadcrumb是否可见
   * @default true
   */
  breadcrumbVisible?: boolean;
  /**
   * breadcrumb高度
   * @default 30
   */
  breadcrumbHeight?: number;
  /**
   * breadcrumb 背景颜色
   * @default #fff
   */
  breadcrumbBackgroundColor?: string;
  /**
   * 混合侧边扩展区域是否可见
   * @default false
   */
  mixedExtraVisible?: boolean;
  /**
   * 固定混合侧边菜单
   * @default false
   */
  fixedMixedExtra?: boolean;
}
