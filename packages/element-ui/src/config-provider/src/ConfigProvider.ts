import { PropType, computed, defineComponent, renderSlot } from 'vue';
import { createConfigProviderContext, useConfigProviderContext } from './constants';

export const configProviderProps = {
  locale: Object as PropType<object | null>,
  theme: Object as PropType<object | null>,
};

const ConfigProvider = defineComponent({
  name: 'EtfmaConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    const ConfigProvider = useConfigProviderContext();
    const mergedThemeRef = computed(() => {
      const { theme } = props;
      if (theme === null) return undefined;
      const inheritedTheme = ConfigProvider?.mergedThemeRef.value;
      return theme === undefined
        ? inheritedTheme
        : inheritedTheme === undefined
        ? theme
        : Object.assign({}, inheritedTheme, theme);
    });

    const mergedLocaleRef = computed(() => {
      const { locale } = props;
      if (locale === null) return undefined;
      return locale === undefined ? ConfigProvider?.mergedLocaleRef.value : locale;
    });

    createConfigProviderContext({
      mergedThemeRef,
      mergedLocaleRef,
    });

    const configRef = computed(() => {
      return {
        mergedTheme: mergedThemeRef.value,
        mergedLocale: mergedLocaleRef.value,
      };
    });

    return () => renderSlot(slots, 'default', { config: configRef.value });
  },
});

export default ConfigProvider;
