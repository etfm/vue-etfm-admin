import { withInstall } from '@etfm/shared';
import Popper from './src/popper.vue';

import EtfmaPopperArrow from './src/arrow.vue';
import EtfmaPopperTrigger from './src/trigger.vue';
import EtfmaPopperContent from './src/content.vue';

export { EtfmaPopperArrow, EtfmaPopperTrigger, EtfmaPopperContent };

export const EtfmaPopper = withInstall(Popper);
export default EtfmaPopper;

export * from './src/popper';
export * from './src/trigger';
export * from './src/content';
export * from './src/arrow';
export * from './src/constants';

export type { Placement, Options } from '@popperjs/core';

export * from './src/composables';
