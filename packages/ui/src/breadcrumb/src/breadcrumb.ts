import { buildProps, definePropType } from '@etfma/shared';
import type { Component, ExtractPropTypes } from 'vue';

export const iconPropType = definePropType<string | Component>([String, Object, Function]);

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
