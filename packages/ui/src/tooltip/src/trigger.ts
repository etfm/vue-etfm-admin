import { buildProps, definePropType } from '@etfma/shared';
import { popperTriggerProps } from '../../popper';
import { EVENT_CODE } from '../../focus-trap';
import type { Arrayable } from '@etfma/types';
import type { ExtractPropTypes } from 'vue';

export type TooltipTriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';

export const useTooltipTriggerProps = buildProps({
  ...popperTriggerProps,
  /**
   * @description whether Tooltip is disabled
   */
  disabled: Boolean,
  /**
   * @description How should the tooltip be triggered (to show)
   */
  trigger: {
    type: definePropType<Arrayable<TooltipTriggerType>>([String, Array]),
    default: 'hover',
  },
  /**
   * @description When you click the mouse to focus on the trigger element, you can define a set of keyboard codes to control the display of tooltip through the keyboard
   */
  triggerKeys: {
    type: definePropType<string[]>(Array),
    default: () => [EVENT_CODE.enter, EVENT_CODE.space],
  },
} as const);

export type ElTooltipTriggerProps = ExtractPropTypes<typeof useTooltipTriggerProps>;
