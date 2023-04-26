import { ElMessage, ElNotification, ElMessageBox, ElMessageBoxOptions } from 'element-plus';

declare type MessageType = '' | 'success' | 'warning' | 'info' | 'error';

function createConfirm(options: ElMessageBoxOptions) {
  Reflect.deleteProperty(options, 'type');
  const opt: ElMessageBoxOptions = {
    ...options,
  };
  return ElMessageBox.confirm(opt.message, opt.title, opt);
}

const getBaseOptions = () => {
  return {};
};

function createModalOptions(options: ElMessageBoxOptions, type: MessageType): ElMessageBoxOptions {
  return {
    ...getBaseOptions(),
    ...options,
    type: type,
  };
}

function createSuccessModal(options: ElMessageBoxOptions) {
  return ElMessageBox.alert(options.message, options.title, createModalOptions(options, 'success'));
}

function createErrorModal(options: ElMessageBoxOptions) {
  return ElMessageBox.alert(options.message, options.title, createModalOptions(options, 'error'));
}

function createInfoModal(options: ElMessageBoxOptions) {
  return ElMessageBox.alert(options.message, options.title, createModalOptions(options, 'info'));
}

function createWarningModal(options: ElMessageBoxOptions) {
  return ElMessageBox.alert(options.message, options.title, createModalOptions(options, 'warning'));
}

export function useMessage() {
  return {
    createMessage: ElMessage,
    notification: ElNotification,
    createConfirm: createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
