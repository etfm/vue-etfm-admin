import { ISkeleton } from './skeleton';
import { IPublicTypeWidgetBaseConfig } from './widget-base-config';
import { IPublicTypeWidgetConfigArea } from './widget-config-area';

export interface IWidget {
  readonly name: string;
  readonly area: IPublicTypeWidgetConfigArea;
  readonly content: any;
  readonly align?: string;
  readonly visible: boolean;
  readonly body: any;
  readonly skeleton: ISkeleton;
  readonly config: IPublicTypeWidgetBaseConfig;
  getName(): string;
  getContent(): any;
  show(): void;
  hide(): void;
  toggle(): void;

  [x: string]: any;
}

export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    [x: string]: any;
  };
  content?: any;
}
