import { ISkeleton } from './skeleton';
import { IPublicTypeWidgetBaseConfig } from './widget-base-config';

export interface IWidget {
  readonly name: string;
  readonly content: any;
  readonly align?: string;
  readonly isWidget: true;
  readonly visible: boolean;
  readonly disabled?: boolean;
  readonly body: any;
  readonly skeleton: ISkeleton;
  readonly config: IPublicTypeWidgetBaseConfig;

  getName(): string;
  getContent(): any;
  show(): void;
  hide(): void;
  toggle(): void;
  enable?(): void;
  disable?(): void;
}

export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Widget';
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    [x: string]: any;
  };
  content?: any;
}
