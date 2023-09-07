import { useNamespace } from '@etfm/hooks';
import { theme } from 'etfm-engine';
import { config } from 'etfm-engine';

const ns = useNamespace('');

const cssDarkMap = {
  '#409eff': ns.cssVar({
    'aside-area-bg-color': '#001529',
    'menu-bg-sub-menu-item-active-color': '#409eff',
  }),
  '#f5222d': ns.cssVar({
    'aside-area-bg-color': '#2a0608',
    'menu-bg-sub-menu-item-active-color': '#f5222d',
  }),
  '#fa541c': ns.cssVar({
    'aside-area-bg-color': '#2b0e05',
    'menu-bg-sub-menu-item-active-color': '#fa541c',
  }),
  '#fadb14': ns.cssVar({
    'aside-area-bg-color': '#2b2503',
    'menu-bg-sub-menu-item-active-color': '#fadb14',
  }),
  '#13c2c2': ns.cssVar({
    'aside-area-bg-color': '#032121',
    'menu-bg-sub-menu-item-active-color': '#13c2c2',
  }),
  '#52c41a': ns.cssVar({
    'aside-area-bg-color': '#0b1e15',
    'menu-bg-sub-menu-item-active-color': '#52c41a',
  }),
  '#eb2f96': ns.cssVar({
    'aside-area-bg-color': '#28081a',
    'menu-bg-sub-menu-item-active-color': '#eb2f96',
  }),
  '#722ed1': ns.cssVar({
    'aside-area-bg-color': '#130824',
    'menu-bg-sub-menu-item-active-color': '#722ed1',
  }),
};

const cssLightMap = ns.cssVar({
  'aside-area-bg-color': `var(${ns.cssVarName('bg-color')})`,
  'header-area-bg-color': `var(${ns.cssVarName('bg-color')})`,
  'menu-bg-sub-menu-item-color': 'inherit',
  'menu-text-color': `var(${ns.cssVarName('text-color-primary')})`,
  'menu-active-color': `var(${ns.cssVarName('color-primary')})`,
  'menu-bg-sub-menu-item-active-color': `rgba(242, 243, 245)`,
  'menu-bg-sub-menu-item-hover-color': `rgba(242, 243, 245)`,
  'menu-hover-text-color': 'initial',
});

export function useColor(props: { theme: 'light' | 'dark' }) {
  function changLight(color: string) {
    theme.change(color, { overrides: cssLightMap });
  }
  // #0f0303
  function changeDark(color: string) {
    let overrides: Record<string, any>;

    if (config.get('layout') !== 'aside') {
      overrides = {
        ...ns.cssVar({
          'header-area-bg-color': darkBgColorMap[color],
        }),
      };
    } else {
      overrides = {
        ...ns.cssVar({
          'header-area-bg-color': `var(${ns.cssVarName('bg-color')})`,
        }),
      };
    }

    overrides = {
      ...overrides,
      ...cssDarkMap[color],
      ...ns.cssVar({
        'menu-bg-sub-menu-item-hover-color': 'initial',
        'menu-hover-text-color': '#fff',
        'menu-active-color': '#fff',
        'menu-bg-sub-menu-item-color': '#0f0303',
        'menu-text-color': 'rgba(254,254,254,0.65)',
      }),
    };

    theme.change(color, { overrides });
  }

  config.onGot('layout', (layout: string) => {
    if (layout !== 'aside') {
      if (props.theme === 'dark') {
        theme.setCssVar({
          ...theme.cssVar,
          ...ns.cssVar({
            'header-area-bg-color': darkBgColorMap[theme.color],
          }),
        });
      } else {
        theme.setCssVar({
          ...theme.cssVar,
          ...ns.cssVar({
            'header-area-bg-color': `var(${ns.cssVarName('bg-color')})`,
          }),
        });
      }
    } else {
      theme.setCssVar({
        ...theme.cssVar,
        ...ns.cssVar({
          'header-area-bg-color': `var(${ns.cssVarName('bg-color')})`,
        }),
      });
    }
  });

  return {
    changLight,
    changeDark,
  };
}
