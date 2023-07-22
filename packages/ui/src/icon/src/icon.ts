import { buildProps, definePropType } from '@etfma/shared';
import type { ExtractPropTypes } from 'vue';
import type Icon from './icon.vue';

export const iconProps = buildProps({
  /**
   * @description SVG icon size, size x size
   */
  size: {
    type: definePropType<number | string>([Number, String]),
  },
  /**
   * @description SVG tag's fill attribute
   */
  color: {
    type: String,
  },

  loading: {
    type: Boolean,
    default: false,
  },
} as const);
export type IconProps = ExtractPropTypes<typeof iconProps>;
export type IconInstance = InstanceType<typeof Icon>;
