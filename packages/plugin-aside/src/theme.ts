import { config, common } from '@etfma/core';
import { useNamespace } from '@etfma/hooks';

export function useTheme() {
  const { setCssVar } = common.utils.createTheme();

  const ns = useNamespace('');

  const cssMap = {
    '#409eff': ns.cssVar({
      'menu-bg-color': '#001529',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#f5222d': ns.cssVar({
      'menu-bg-color': '#2a0608',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#fa541c': ns.cssVar({
      'menu-bg-color': '#2b0e05',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#fadb14': ns.cssVar({
      'menu-bg-color': '#2b2503',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#13c2c2': ns.cssVar({
      'menu-bg-color': '#032121',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#52c41a': ns.cssVar({
      'menu-bg-color': '#0b1e15',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#eb2f96': ns.cssVar({
      'menu-bg-color': '#28081a',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
    '#722ed1': ns.cssVar({
      'menu-bg-color': '#130824',
      'menu-bg-sub-menu-item-color': '#0f0303',
      'menu-text-color': 'rgba(254,254,254,0.65)',
    }),
  };

  config.onGot('theme', (theme: any) => {
    setCssVar(cssMap[theme.color]);
  });
}
