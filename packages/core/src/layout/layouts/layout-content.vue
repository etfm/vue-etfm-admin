<script lang="tsx">
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';
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
      const widgets = ref<any[]>(props.skeleton.main);
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
        if (config.area === 'main') {
          widgets.value = list;
        }
      });

      return {
        style,
        area,
      };
    },

    render() {
      const { style, area } = this;

      return <main style={style}>{area}</main>;
    },
  });
</script>
