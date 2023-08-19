<script lang="tsx">
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref } from 'vue';
  import { Skeleton } from '../skeleton';

  export default defineComponent({
    name: 'LayoutContent',
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
       * padding
       * @default 16
       */
      padding: {
        type: Number,
        default: 16,
      },
      /**
       * paddingBottom
       * @default 16
       */
      paddingBottom: {
        type: Number,
        default: 16,
      },
      /**
       * paddingTop
       * @default 16
       */
      paddingTop: {
        type: Number,
        default: 16,
      },
      /**
       * paddingLeft
       * @default 16
       */
      paddingLeft: {
        type: Number,
        default: 16,
      },
      /**
       * paddingRight
       * @default 16
       */

      paddingRight: {
        type: Number,
        default: 16,
      },
    },
    setup(props) {
      const widgetList = ref<any[]>(props.skeleton.main);
      const style = computed((): CSSProperties => {
        const { padding, paddingBottom, paddingTop, paddingLeft, paddingRight } = props;
        return {
          padding: `${padding}px`,
          paddingBottom: `${paddingBottom}px`,
          paddingTop: `${paddingTop}px`,
          paddingLeft: `${paddingLeft}px`,
          paddingRight: `${paddingRight}px`,
        };
      });

      props.skeleton.onWidget((config, list: any) => {
        if (config.area === 'main') {
          widgetList.value = list;
        }
      });

      return {
        style,
        widgetList,
      };
    },

    render() {
      const { style, widgetList } = this;
      return <main style={style}>{widgetList.map((item) => item.content)}</main>;
    },
  });
</script>
