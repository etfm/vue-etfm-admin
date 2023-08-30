<script lang="tsx">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';
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
       * 宽度
       * @default 0
       */
      width: {
        type: String,
        default: 0,
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
        const { backgroundColor, height, fixed, zIndex, show, width } = props;
        return {
          position: fixed ? 'fixed' : 'static',
          zIndex,
          backgroundColor,
          height: `${height}px`,
          width,
          marginBottom: show ? '0' : `-${height}px`,
        };
      });

      const area = computed(() => {
        const block: any[] = [];
        unref(widgets)
          .slice()
          .sort((a, b) => {
            const index1 = a.config?.index || 0;
            const index2 = b.config?.index || 0;
            return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
          })
          .forEach((item) => {
            const content = item.content;

            block.push(content);
          });

        return block;
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'footer') {
          widgets.value = list;
        }
      });

      return {
        b,
        style,
        area,
      };
    },
    render() {
      const { style, b, area } = this;
      return (
        <footer class={b()} style={style}>
          {area}
        </footer>
      );
    },
  });
</script>

<style scoped module lang="scss">
  @include b('footer') {
    bottom: 0;
    transition: all 0.3s;
  }
</style>
