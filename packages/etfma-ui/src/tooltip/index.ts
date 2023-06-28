import { withInstall } from '@etfma/shared';
import Tooltip from './src/tooltip.vue';

export const EtfmaTooltip = withInstall(Tooltip);
export * from './src/tooltip';
export * from './src/trigger';
export * from './src/content';
export * from './src/constants';
export default EtfmaTooltip;
