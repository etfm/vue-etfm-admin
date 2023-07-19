import type { ExtractPropTypes } from 'vue';
import Thumb from './thumb.vue';
import { buildProps } from '@etfma/shared';

export const thumbProps = buildProps({
  vertical: {
    type: Boolean,
    default: true,
  },
  size: String,
  move: Number,
  ratio: {
    type: Number,
    required: true,
  },
  always: {
    type: Boolean,
    default: false,
  },
} as const);
export type ThumbProps = ExtractPropTypes<typeof thumbProps>;

export type ThumbInstance = InstanceType<typeof Thumb>;
