import type { ExtractPropTypes } from 'vue';
import type Bar from './bar.vue';
import { buildProps } from '@etfma/shared';

export const barProps = buildProps({
  always: {
    type: Boolean,
    default: false,
  },
  width: String,
  height: String,
  ratioX: {
    type: Number,
    default: 1,
  },
  ratioY: {
    type: Number,
    default: 1,
  },
} as const);
export type BarProps = ExtractPropTypes<typeof barProps>;

export type BarInstance = InstanceType<typeof Bar>;
