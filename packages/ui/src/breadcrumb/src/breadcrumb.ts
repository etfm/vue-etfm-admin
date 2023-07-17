import { buildProps } from '@etfma/shared';
import { iconPropType } from '../../menu';
import type { ExtractPropTypes } from 'vue';

export const breadcrumbProps = buildProps({
  /**
   * @description separator character
   */
  separator: {
    type: String,
    default: '/',
  },
  /**
   * @description icon component of icon separator
   */
  separatorIcon: {
    type: iconPropType,
  },
} as const);
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;
