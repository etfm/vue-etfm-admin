import { genMessage } from '../helper';

const modules: Record<string, Record<string, any>> = import.meta.glob('./en/**/*.ts', {
  eager: true,
});
export default {
  message: {
    ...genMessage(modules, 'en'),
  },
  locale: 'en',
};
