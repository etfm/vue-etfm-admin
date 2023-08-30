<script lang="tsx">
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, ref, unref } from 'vue';
  import { Skeleton } from '../skeleton';
  import { useNamespace } from '@etfma/hooks';

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

      const { b } = useNamespace('main');
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
        b,
      };
    },

    render() {
      const { style, area, b } = this;

      return (
        <main class={b()} style={style}>
          {area}
        </main>
      );
    },
  });
</script>
<style scoped lang="scss" module>
  @include b('main') {
    flex: 1;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    box-sizing: border-box;
    background-color: getCssVar('fill-color');
  }
</style>
