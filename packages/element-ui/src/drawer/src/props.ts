import { IDrawer, IDrawerFooter, IDrawerHeader } from './typing';

export const footerProps: IDrawerFooter = {
  footerHeight: 60,
  okType: 'primary',
  okText: '确认',
  cancelText: '取消',
  showOkBtn: true,
  showCancelBtn: true,
  confirmLoading: false,
  showFooter: true,
};

export const headerProps: IDrawerHeader = {
  isDetail: false,
  showDetailBack: true,
  title: '',
};

export const basicDrawerProps: IDrawer = {
  visible: false,
  loading: false,
  maskClosable: true,
  destroyOnClose: false,
  ...footerProps,
  ...headerProps,
};
