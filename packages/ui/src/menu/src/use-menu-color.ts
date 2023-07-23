import { computed } from 'vue';
import { TinyColor } from '@ctrl/tinycolor';
import { MenuProps } from './types';

export default function useMenuColor(props: MenuProps) {
  const menuBarColor = computed(() => {
    const color = props.backgroundColor;
    if (!color) {
      return '';
    } else {
      return new TinyColor(color).shade(20).toString();
    }
  });
  return menuBarColor;
}
