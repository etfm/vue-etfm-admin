import { useGetNamespace } from '@etfm/hooks';

const namespace = useGetNamespace();

export const DEFAULT_PRIMARY_VAR = `--${namespace}-color-primary`;
export const DEFAULT_PRIMARY_COLOR = '#409eff';
export const DEFAULT_LIGHT = '#ffffff';
export const DEFAULT_DARK = '#141414';
