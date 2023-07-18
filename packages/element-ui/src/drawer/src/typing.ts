import { CSSProperties, ComputedRef } from 'vue';
import { ButtonType } from 'element-plus';

export interface IDrawerFooter {
  confirmLoading?: boolean;
  showCancelBtn?: boolean;
  cancelButtonProps?: Record<string, any>;
  cancelText?: string;
  showOkBtn?: boolean;
  okButtonProps?: Record<string, any>;
  okText?: string;
  okType?: ButtonType;
  showFooter?: boolean;
  footerHeight?: string | number;
}

export interface IDrawerHeader {
  isDetail?: boolean;
  showDetailBack?: boolean;
  title?: string;
}

export interface DrawerInstance {
  setDrawerProps: (props: Partial<IDrawer> | boolean) => void;
  emitVisible?: (visible: boolean, uid: number | string) => void;
}

export type IDrawer = IDrawerFooter &
  IDrawerHeader & {
    loading?: boolean;
    visible?: boolean;

    closeFunc?: () => Promise<any>;
    triggerWindowResize?: boolean;
    /**
     * Whether a close (x) button is visible on top right of the Drawer dialog or not.
     * @default true
     * @type boolean
     */
    closable?: boolean;

    /**
     * Whether to unmount child components on closing drawer or not.
     * @default false
     * @type boolean
     */
    destroyOnClose?: boolean;

    /**
     * Return the mounted node for Drawer.
     * @default 'body'
     * @type any ( HTMLElement| () => HTMLElement | string)
     */
    getContainer?: () => HTMLElement | string;

    /**
     * Whether to show mask or not.
     * @default true
     * @type boolean
     */
    mask?: boolean;

    /**
     * Clicking on the mask (area outside the Drawer) to close the Drawer or not.
     * @default true
     * @type boolean
     */
    maskClosable?: boolean;

    /**
     * Style for Drawer's mask element.
     * @default {}
     * @type object
     */
    maskStyle?: CSSProperties;

    /**
     * The class name of the container of the Drawer dialog.
     * @type string
     */
    wrapClassName?: string;
    class?: string;
    /**
     * Style of wrapper element which **contains mask** compare to `drawerStyle`
     * @type object
     */
    wrapStyle?: CSSProperties;

    /**
     * Style of the popup layer element
     * @type object
     */
    drawerStyle?: CSSProperties;

    /**
     * Style of floating layer, typically used for adjusting its position.
     * @type object
     */
    bodyStyle?: CSSProperties;
    headerStyle?: CSSProperties;

    /**
     * Width of the Drawer dialog.
     * @default 256
     * @type string | number
     */
    width?: string | number;

    /**
     * placement is top or bottom, height of the Drawer dialog.
     * @type string | number
     */
    height?: string | number;

    /**
     * The z-index of the Drawer.
     * @default 1000
     * @type number
     */
    zIndex?: number;

    /**
     * The placement of the Drawer.
     * @default 'right'
     * @type string
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    afterVisibleChange?: (visible?: boolean) => void;
    keyboard?: boolean;
    /**
     * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
     */
    onClose?: (e?: Event) => void;

    loadingText?: string;
  };

export interface ReturnMethods extends DrawerInstance {
  openDrawer: <T = any>(visible?: boolean, data?: T, openOnSet?: boolean) => void;
  closeDrawer: () => void;
  getVisible?: ComputedRef<boolean>;
}

export type RegisterFn = (drawerInstance: DrawerInstance, uuid: string | number) => void;

export interface ReturnInnerMethods extends DrawerInstance {
  closeDrawer: () => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  getVisible?: ComputedRef<boolean>;
}

export type UseDrawerReturnType = [RegisterFn, ReturnMethods];

export type UseDrawerInnerReturnType = [RegisterFn, ReturnInnerMethods];

export interface DrawerActionType {
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
  getScrollWrap: () => Element | null;
}
