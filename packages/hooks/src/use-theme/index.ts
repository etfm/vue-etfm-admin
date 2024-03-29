import {
  PRE,
  PRE_DARK,
  PRE_LIGHT,
  WHITE,
  BLACK,
  ETFM_PRE,
  ETFM_PRE_LIGHT,
  ETFM_PRE_DARK,
  DARK_WHITE,
  DARK_BLOCK,
} from './token';
import { onBeforeMount, ref } from 'vue';

import { useDark } from '@vueuse/core';

const html = document.documentElement;

const colorRef = ref('#409eff');

const isDark = useDark();
/**
 * 混合颜色
 */
const mix = (color1: string, color2: string, weight: number) => {
  weight = Math.max(Math.min(Number(weight), 1), 0);
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  const _r = ('0' + (r || 0).toString(16)).slice(-2);
  const _g = ('0' + (g || 0).toString(16)).slice(-2);
  const _b = ('0' + (b || 0).toString(16)).slice(-2);
  return '#' + _r + _g + _b;
};

/**
 * 更换颜色的方法
 * @param color 颜色
 */
const changeTheme = (color?: string) => {
  if (color) {
    colorRef.value = color;
  }

  let colors = {
    WHITE,
    BLACK,
  };

  if (isDark.value) {
    colors = {
      WHITE: DARK_WHITE,
      BLACK: DARK_BLOCK,
    };
  }

  // 设置主要颜色
  html.style.setProperty(PRE, colorRef.value);
  html.style.setProperty(ETFM_PRE, colorRef.value);
  // 循环设置次级颜色
  for (let i = 1; i < 10; i += 1) {
    html.style.setProperty(`${PRE_LIGHT}-${i}`, mix(colorRef.value, colors.WHITE, i * 0.1));
    html.style.setProperty(`${ETFM_PRE_LIGHT}-${i}`, mix(colorRef.value, colors.WHITE, i * 0.1));
  }
  // 设置主要暗色
  const dark = mix(colorRef.value, colors.BLACK, 0.2);
  html.style.setProperty(`${PRE_DARK}-2`, dark);
  html.style.setProperty(`${ETFM_PRE_DARK}-2`, dark);
};

export function useTheme(color?: string) {
  onBeforeMount(() => changeTheme(color));

  return {
    changeTheme,
  };
}
