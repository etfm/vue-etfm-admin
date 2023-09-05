<script lang="tsx">
  import { useNamespace } from '@etfm/hooks';
  import { ISkeleton } from '@etfm/types';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';

  export default defineComponent({
    name: 'LayoutToolbar',
    props: {
      /**
       * 框架实例
       * @default
       */
      skeleton: {
        type: Object as PropType<ISkeleton>,
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
       * @default 30
       */
      height: {
        type: Number,
        default: 30,
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
        const { backgroundColor, fixed, width } = props;
        return {
          ...hiddenStyle.value,
          position: fixed ? 'fixed' : 'static',
          display: 'flex',
          backgroundColor,
          width,
        };
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'toolbar') {
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
            <div class={e('left')}>{area.left}</div>
            <div class={e('center')}>{area.center}</div>
            <div class={e('right')}>{area.right}</div>
          </section>
        </>
      );
    },
  });
</script>

<style scoped module lang="scss">
  @include b('toolbar') {
    @include set-component-css-var('toolbar', $toolbar-area);

    width: 100%;
    transition: all 0.3s ease 0s;
    background-color: getCssVar('toolbar', 'bg-color');

    @include e('hide') {
      background: transparent;
    }

    @include e('left') {
      display: flex;
      align-items: center;
    }

    @include e('center') {
      display: flex;
      flex: 1;
      align-items: center;
    }

    @include e('right') {
      display: flex;
      align-items: center;
    }
  }
</style>
