import { withInstall } from '@etfma/shared';

import basicArrow from './src/basic-arrow.vue';
import basicHelp from './src/basic-help.vue';
import basicTitle from './src/basic-title.vue';

export const BasicArrow = withInstall(basicArrow);
export const BasicHelp = withInstall(basicHelp);
export const BasicTitle = withInstall(basicTitle);

export * from './src/props';
