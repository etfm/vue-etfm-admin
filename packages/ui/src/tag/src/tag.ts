import { buildProps } from '@etfm/shared';
import { componentSizes } from '../../constants';
import type Tag from './tag.vue';

import type { ExtractPropTypes } from 'vue';

export const tagProps = buildProps({
  /**
   * @description type of Tag
   */
  type: {
    type: String,
    values: ['success', 'info', 'warning', 'danger', ''],
    default: '',
  },
  /**
   * @description whether Tag can be removed
   */
  closable: {
    type: Boolean,
  },
  /**
   * @description whether to disable animations
   */
  disableTransitions: Boolean,
  /**
   * @description whether Tag has a highlighted border
   */
  hit: {
    type: Boolean,
  },
  /**
   * @description background color of the Tag
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * @description size of Tag
   */
  size: {
    type: String,
    values: componentSizes,
    default: '',
  },
  /**
   * @description theme of Tag
   */
  effect: {
    type: String,
    values: ['dark', 'light', 'plain'],
    default: 'light',
  },
  /**
   * @description whether Tag is rounded
   */
  round: {
    type: Boolean,
  },
} as const);
export type TagProps = ExtractPropTypes<typeof tagProps>;

export const tagEmits = {
  close: (evt: MouseEvent) => evt instanceof MouseEvent,
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
};
export type TagEmits = typeof tagEmits;

export type TagInstance = InstanceType<typeof Tag>;
