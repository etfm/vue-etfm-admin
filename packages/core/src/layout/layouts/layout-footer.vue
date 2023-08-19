<script lang="tsx">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref } from 'vue';
  import { Skeleton } from '../skeleton';

  export default defineComponent({
    name: 'LayoutFooter',
    props: {
      /**
       * 框架实例
       * @default
       */
      skeleton: {
        type: Object as PropType<Skeleton>,
        required: true,
      },
      /**
       * 是否显示
       * @default true
       */
      show: {
        type: Boolean,
        default: true,
      },
      /**
       * zIndex
       * @default 0
       */
      zIndex: {
        type: Number,
        default: 0,
      },
      /**
       * 背景颜色
       * @default
       */
      backgroundColor: {
        type: String,
      },
      /**
       * 高度
       * @default 32
       */
      height: {
        type: Number,
        default: 32,
      },
      /**
       * 是否固定在顶部
       * @default true
       */
      fixed: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const { b } = useNamespace('footer');

      const widgets = ref<any[]>(props.skeleton.footer);

      const style = computed((): CSSProperties => {
        const { backgroundColor, height, fixed, zIndex, show } = props;
        return {
          position: fixed ? 'fixed' : 'static',
          zIndex,
          backgroundColor,
          height: `${height}px`,
          marginBottom: show ? '0' : `-${height}px`,
        };
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'footer') {
          widgets.value = list;
        }
      });

      return {
        b,
        style,
        widgets,
      };
    },
    render() {
      const { style, b, widgets } = this;
      return (
        <footer class={b()} style={style}>
          {widgets.map((item) => item.content)}
        </footer>
      );
    },
  });
</script>

<style scoped module lang="scss">
  @include b('footer') {
    bottom: 0;
    width: 100%;
    transition: all 0.3s;
  }
</style>
