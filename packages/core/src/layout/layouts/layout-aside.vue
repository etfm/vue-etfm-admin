<script lang="tsx">
  import { useNamespace } from '@etfma/hooks';
  import { onClickOutside } from '@vueuse/core';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, shallowRef, unref, watchEffect } from 'vue';
  import { Skeleton } from '../skeleton.js';
  import { IWidget } from '@etfma/types';

  export default defineComponent({
    name: 'LayoutAside',
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
       * 隐藏的dom是否可见
       * @default true
       */
      domVisible: {
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
       */
      backgroundColor: {
        type: String,
      },
      /**
       * 宽度
       * @default 180
       */
      width: {
        type: Number,
        default: 180,
      },
      /**
       * 扩展区域宽度
       * @default 180
       */
      sideExtraWidth: {
        type: Number,
        default: 180,
      },
      /**
       * 是否侧边混合模式
       * @default false
       */
      fixedMixedExtra: {
        type: Boolean,
        default: false,
      },
      /**
       * 是否侧边混合模式
       * @default false
       */
      isSideMixed: {
        type: Boolean,
        default: false,
      },
      /**
       * 顶部padding
       * @default 60
       */
      paddingTop: {
        type: Number,
        default: 60,
      },
      /**
       * 混合侧边扩展区域是否可见
       * @default false
       */
      mixedExtraVisible: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['extraVisible'],
    setup(props, { emit }) {
      const { b, e } = useNamespace('aside');

      const asideRef = shallowRef<HTMLDivElement | null>();
      const extraVisible = ref(false);
      const asideWidgetList = ref<IWidget[]>(props.skeleton.aside);
      const extraWidgetList = ref<IWidget[]>(props.skeleton.extra);

      const hiddenSideStyle = computed((): CSSProperties => {
        const { backgroundColor, width, show, fixedMixedExtra, isSideMixed, sideExtraWidth } =
          props;
        const widthValue = `${width + (isSideMixed && fixedMixedExtra ? sideExtraWidth : 0)}px`;

        return {
          marginLeft: show ? 0 : `-${widthValue}`,
          flex: `0 0 ${widthValue}`,
          width: widthValue,
          minWidth: widthValue,
          maxWidth: widthValue,
          backgroundColor,
        };
      });

      const style = computed((): CSSProperties => {
        const { paddingTop, zIndex } = props;
        return {
          ...hiddenSideStyle.value,
          paddingTop: `${paddingTop}px`,
          zIndex,
        };
      });

      const extraStyle = computed((): CSSProperties => {
        const { backgroundColor, zIndex, sideExtraWidth, width } = props;

        return {
          zIndex,
          left: `${width}px`,
          width: extraVisible.value ? `${sideExtraWidth}px` : 0,
          backgroundColor,
        };
      });

      watchEffect(() => {
        extraVisible.value = props.fixedMixedExtra ? true : props.mixedExtraVisible;
      });

      onClickOutside(asideRef, (event) => {
        const { fixedMixedExtra, width } = props;
        // 防止点击 aside 区域关闭
        if (!fixedMixedExtra && event.clientX >= width) {
          if (extraVisible.value) {
            emit('extraVisible', false);
          }
        }
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'aside') {
          asideWidgetList.value = list;
        } else if (config.area === 'extra') {
          extraWidgetList.value = list;
        }
      });

      const aside = computed(() => {
        const left: any[] = [];
        const center: any[] = [];
        const right: any[] = [];
        unref(asideWidgetList)
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
            } else if (item.align === 'right') {
              right.push(content);
            } else {
              left.push(content);
            }
          });

        return {
          left,
          center,
          right,
        };
      });

      const extra = computed(() => {
        const left: any[] = [];
        const center: any[] = [];
        const right: any[] = [];
        unref(extraWidgetList)
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
            } else if (item.align === 'right') {
              right.push(content);
            } else {
              left.push(content);
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
        extra,
        aside,
        extraStyle,
        hiddenSideStyle,
        asideRef,
      };
    },
    render() {
      const { domVisible, hiddenSideStyle, e, b, style, isSideMixed, extraStyle, aside, extra } =
        this;
      return (
        <>
          {domVisible && <div style={hiddenSideStyle} class={e('hide')}></div>}
          <aside style={style} class={b()}>
            {aside.left}
            {aside.center}
            {aside.right}
            {isSideMixed && (
              <div ref="asideRef" style={extraStyle} class={e('extra')}>
                {extra.left}
                {extra.center}
                {extra.right}
              </div>
            )}
          </aside>
        </>
      );
    },
  });
</script>

<style scoped module lang="scss">
  :root {
    @include set-component-css-var('aside', $aside-area);
  }

  @include b('aside') {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    transition: all 0.2s ease 0s;
    background-color: getCssVar('aside', 'bg-color');

    @include e('hide') {
      height: 100%;
      transition: all 0.2s ease 0s;
    }

    @include e('extra') {
      position: fixed;
      top: 0;
      height: 100%;
      overflow: hidden;
      transition: all 0.2s ease 0s;
    }
  }
</style>
