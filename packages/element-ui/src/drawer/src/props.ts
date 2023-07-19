import { buildProps, definePropType } from '@etfma/shared';
import { ButtonType } from 'element-plus';
import { CSSProperties, ExtractPropTypes } from 'vue';

export const headerProps = buildProps({
  isDetail: {
    type: Boolean,
    default: false,
  },
  showDetailBack: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
});

export type HeaderProps = ExtractPropTypes<typeof headerProps>;

export const footerProps = buildProps({
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
  cancelButtonProps: {
    type: definePropType<Record<string, any>>(Object),
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  showOkBtn: {
    type: Boolean,
    default: true,
  },
  okButtonProps: {
    type: definePropType<Record<string, any>>(Object),
  },
  okText: {
    type: String,
    default: '确认',
  },
  okType: {
    type: definePropType<ButtonType>(String),
    default: 'primary',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  footerHeight: {
    type: definePropType<number | string>([Number, String]),
    default: 60,
  },
});

export type FooterProps = ExtractPropTypes<typeof footerProps>;

export const drawerProps = buildProps({
  loading: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  closeFunc: {
    type: definePropType<() => Promise<any>>(Function),
  },
  triggerWindowResize: {
    type: Boolean,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  getContainer: {
    type: definePropType<() => HTMLElement | string>(Function),
  },
  mask: {
    type: Boolean,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  maskStyle: {
    type: definePropType<CSSProperties>(Object),
  },
  wrapClassName: {
    type: String,
  },
  class: {
    type: String,
  },
  wrapStyle: {
    type: definePropType<CSSProperties>(Object),
  },
  drawerStyle: {
    type: definePropType<CSSProperties>(Object),
  },
  bodyStyle: {
    type: definePropType<CSSProperties>(Object),
  },
  headerStyle: {
    type: definePropType<CSSProperties>(Object),
  },
  with: {
    type: definePropType<string | number>([String, Number]),
    default: 256,
  },
  height: {
    type: definePropType<string | number>([String, Number]),
  },
  zIndex: {
    type: Number,
    default: 1000,
  },
  direction: {
    type: definePropType<'ltr' | 'rtl' | 'ttb' | 'btt'>(String),
    default: 'rtl',
  },
  afterVisibleChange: {
    type: definePropType<(visible?: boolean) => void>(Function),
  },
  keyboard: {
    type: String,
  },
  onClose: {
    type: definePropType<(e?: Event) => void>(Function),
  },
  loadingText: {
    type: String,
  },
  ...headerProps,
  ...footerProps,
});

export type DrawerProps = ExtractPropTypes<typeof drawerProps>;
