import type { ExtractPropTypes } from 'vue';
import Thumb from './thumb.vue';
import { buildProps } from '@etfm/shared';

export const thumbProps = buildProps({
  vertical: Boolean,
  size: String,
  move: Number,
  ratio: {
    type: Number,
    required: true,
  },
  always: Boolean,
} as const);
export type ThumbProps = ExtractPropTypes<typeof thumbProps>;

export type ThumbInstance = InstanceType<typeof Thumb>;
