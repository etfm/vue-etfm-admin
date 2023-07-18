import { Placement } from 'element-plus';

export interface IBasicArrow {
  expand: boolean;
  up: boolean;
  down: boolean;
  inset: boolean;
}

export interface IBasicHelp {
  placement?: Placement;
  content?: string;
}

export interface IBasicTitle {
  helpMessage?: string | string[];
  span?: boolean;
  normal?: boolean;
}
