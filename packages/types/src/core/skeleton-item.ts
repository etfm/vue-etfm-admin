import { IPublicTypeWidgetConfigArea } from './widget-config-area';

export interface IPublicModelSkeletonItem {
  name: string;

  area: IPublicTypeWidgetConfigArea;

  hide(): void;

  show(): void;

  toggle(): void;
}
