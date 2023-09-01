<script lang="tsx">
  import { useNamespace } from '@etfma/hooks';
  import { ISkeleton } from '@etfma/types';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';

  export default defineComponent({
    name: 'LayoutHeader',
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
       * @default 60
       */
      height: {
        type: Number,
        default: 60,
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
       * 横屏
       * @default false
       */
      fullWidth: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const { b, e } = useNamespace('header');

      const widgets = ref<any[]>(props.skeleton.header);

      const hiddenHeaderStyle = computed((): CSSProperties => {
        const { height, show, fixed } = props;
        const heightValue = `${height}px`;

        return {
          marginTop: show ? 0 : `-${heightValue}`,
          height: heightValue,
          lineHeight: heightValue,
          display: fixed ? 'flex' : 'none',
        };
      });

      const style = computed((): CSSProperties => {
        const { backgroundColor, height, fixed, zIndex, show, fullWidth, width } = props;
        const right = !show || !fullWidth ? undefined : 0;

        return {
          position: fixed ? 'fixed' : 'static',
          marginTop: show ? 0 : `-${height}px`,
          backgroundColor,
          height: `${height}px`,
          width,
          zIndex,
          right,
        };
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'header') {
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
        hiddenHeaderStyle,
        style,
        area,
      };
    },
    render() {
      const { b, e, hiddenHeaderStyle, style, area } = this;

      return (
        <>
          <div style={hiddenHeaderStyle} class={e('hide')}></div>
          <header style={style} class={b()}>
            <div class={e('left')}>{area.left}</div>
            <div class={e('center')}>{area.center}</div>
            <div class={e('right')}>{area.right}</div>
          </header>
        </>
      );
    },
  });
</script>

<style scoped module lang="scss">
  @include b('header') {
    @include set-component-css-var('header', $header-area);

    top: 0;
    width: 100%;
    transition: all 0.3s ease 0s;
    display: flex;
    background-color: getCssVar('header', 'bg-color');
    border-bottom: 1px solid getCssVar('border-color');
    box-sizing: border-box;

    @include e('hide') {
      flex: 0 0 auto;
      width: 100%;
      background: transparent;
      transition: all 0.3s ease 0s;
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
