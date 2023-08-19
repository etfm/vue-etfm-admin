<script lang="tsx">
  import { useNamespace } from '@etfma/hooks';
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';
  import { Skeleton } from '../skeleton';

  export default defineComponent({
    name: 'LayoutHeader',
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
       * @default 60
       */
      height: {
        type: Number,
        default: 60,
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

        console.log(heightValue, '8888888888888');

        return {
          marginTop: show ? 0 : `-${heightValue}`,
          height: heightValue,
          lineHeight: heightValue,
          display: fixed ? 'flex' : 'none',
        };
      });

      const style = computed((): CSSProperties => {
        const { backgroundColor, height, fixed, zIndex, show, fullWidth } = props;
        const right = !show || !fullWidth ? undefined : 0;

        console.log(height, '/////////////');

        return {
          position: fixed ? 'fixed' : 'static',
          marginTop: show ? 0 : `-${height}px`,
          backgroundColor,
          height: `${height}px`,
          zIndex,
          right,
        };
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'header') {
          widgets.value = list;
        }
      });

      const headerList = computed(() => {
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
        headerList,
      };
    },
    render() {
      const { b, e, hiddenHeaderStyle, style, headerList } = this;

      return (
        <>
          01211111111111111
          <div style={hiddenHeaderStyle} class={e('hide')}></div>
          <header style={style} class={b()}>
            {headerList.left}
            {headerList.center}
            {headerList.right}
          </header>
        </>
      );
    },
  });
</script>

<template> </template>

<style scoped module lang="scss">
  @include b('header') {
    top: 0;
    width: 100%;
    transition: all 0.3s ease 0s;

    @include e('hide') {
      flex: 0 0 auto;
      width: 100%;
      background: transparent;
      transition: all 0.3s ease 0s;
    }
  }
</style>
