import { buildProps, definePropType } from '@etfm/shared';
import { Placement } from 'element-plus';
import { ExtractPropTypes } from 'vue';

export const basicArrowProps = buildProps({
  expand: {
    type: Boolean,
  },
  up: {
    type: Boolean,
  },
  down: {
    type: Boolean,
  },
  inset: {
    type: Boolean,
  },
} as const);

export type BasicArrowProps = ExtractPropTypes<typeof basicArrowProps>;

export const basicHelpProps = buildProps({
  placement: {
    type: definePropType<Placement>(String),
    default: 'right',
  },
  content: {
    type: String,
  },
} as const);

export type BasicHelpProps = ExtractPropTypes<typeof basicHelpProps>;

export const basicTitleProps = buildProps({
  helpMessage: {
    type: definePropType<string | string[]>([String, Array<String>]),
    default: '',
  },
  span: {
    type: Boolean,
    default: false,
  },
  normal: {
    type: Boolean,
    default: false,
  },
} as const);

export type BasicTitleProps = ExtractPropTypes<typeof basicTitleProps>;
