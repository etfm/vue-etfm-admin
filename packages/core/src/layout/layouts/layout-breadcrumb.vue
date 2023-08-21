<script lang="tsx">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';
  import { Skeleton } from '../skeleton';

  export default defineComponent({
    name: 'LayoutBreadcrumb',
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
       * @default 56
       */
      height: {
        type: Number,
        default: 56,
      },
      /**
       * 是否固定在顶部
       * @default true
       */
      fixed: {
        type: Boolean,
        default: true,
      },
      /**
       * top 值
       * @default 0
       */
      top: {
        type: Number,
        default: 0,
      },
    },
    setup(props) {
      const { b, e } = useNamespace('toolbar');

      const widgets = ref<any[]>(props.skeleton.toolbar);

      const hiddenStyle = computed((): CSSProperties => {
        const { height, zIndex, top, fixed } = props;
        return {
          top: `${top}px`,
          height: `${height}px`,
          zIndex,
          display: fixed ? 'flex' : 'none',
        };
      });

      const style = computed((): CSSProperties => {
        const { backgroundColor, fixed } = props;
        return {
          ...hiddenStyle.value,
          position: fixed ? 'fixed' : 'static',
          display: 'flex',
          backgroundColor,
        };
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'breadcrumb') {
          widgets.value = list;
        }
      });

      const area = computed(() => {
        const left: any[] = [];
        const center: any[] = [];
        const right: any[] = [];
        unref(widgets)
          .slice()
          .sort((a, b) => {
            const index1 = a.config?.index || 0;
            const index2 = b.config?.index || 0;
            return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
          })
          .forEach((item) => {
            const content = item.content;
            if (item.align === 'center') {
              center.push(content);
            } else if (item.align === 'left') {
              left.push(content);
            } else {
              right.push(content);
            }
          });

        return {
          left,
          center,
          right,
        };
      });

      return {
        b,
        e,
        style,
        hiddenStyle,
        area,
      };
    },
    render() {
      const { b, e, style, hiddenStyle, area } = this;
      return (
        <>
          <div class={e('hide')} style={hiddenStyle}></div>
          <section class={b()} style={style}>
            {area.left}
            {area.center}
            {area.right}
          </section>
        </>
      );
    },
  });
</script>

<style scoped module lang="scss">
  @include b('breadcrumb') {
    width: 100%;
    transition: all 0.3s ease 0s;

    @include e('hide') {
      background: transparent;
    }
  }
</style>
