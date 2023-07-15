import { defineComponent, h, unref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'redirect',
  setup() {
    const { currentRoute, replace } = useRouter();

    const { params, query } = unref(currentRoute);
    const { path, _redirect_type = 'path' } = params;

    Reflect.deleteProperty(params, '_redirect_type');
    Reflect.deleteProperty(params, 'path');

    const _path = Array.isArray(path) ? path.join('/') : path;

    if (_redirect_type === 'name') {
      replace({
        name: _path,
        query,
        params: JSON.parse((params._origin_params as string) ?? '{}'),
      });
    } else {
      replace({
        path: _path.startsWith('/') ? _path : '/' + _path,
        query,
      });
    }
  },
  render() {
    return h('div');
  },
});
