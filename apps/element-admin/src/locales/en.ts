import { genMessage } from './helper';

const modules: Record<string, Record<string, any>> = import.meta.globEager('./en/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'en'),
  },
  dateLocale: 'en',
  dateLocaleName: 'en',
};
