<script lang="tsx">
  import { defineComponent, PropType, ref, unref } from 'vue';
  import { Widget } from '../../widget';
  import DraggableLine from '../draggable-line/index.vue';
  import { useNamespace } from '@etfma/hooks';
  import classNames from 'classnames';
  import { SkeletonEvents } from '@etfma/types';

  export default defineComponent({
    name: 'DraggableLineView',
    props: {
      widget: {
        type: Object as PropType<Widget>,
        required: true,
      },
    },
    setup(props) {
      const ns = useNamespace('draggable-line');
      const shell = ref();
      let defaultWidth: number;

      const getDefaultWidth = () => {
        const configWidth = props.widget?.config.props?.width;
        if (configWidth) {
          return configWidth;
        }
        if (defaultWidth) {
          return defaultWidth;
        }
        const containerRef = unref(shell)?.getParent();
        if (containerRef) {
          defaultWidth = containerRef.offsetWidth;
          return defaultWidth;
        }
        return 300;
      };

      const onDrag = (value: number) => {
        const defaultWidth = getDefaultWidth();
        const width = defaultWidth + value;

        const containerRef = unref(shell)?.getParent();
        if (containerRef) {
          containerRef.style.width = `${width}px`;
        }

        const skeleton = props.widget.skeleton;
        skeleton.postEvent(SkeletonEvents.WIDGET_DRAG, width);
      };

      const onDragChange = (type: 'start' | 'end') => {
        const skeleton = props.widget.skeleton;
        skeleton.postEvent(SkeletonEvents.WIDGET_DRAG_CHANGE, type);
      };

      return {
        onDrag,
        onDragChange,
        shell,
        ns,
      };
    },
    render() {
      const { ns } = this;

      return (
        <DraggableLine
          ref={(ref) => {
            this.shell = ref as any;
          }}
          position="right"
          class={classNames(ns.b(), ns.m('right'))}
          onDrag={(e) => this.onDrag(e)}
          onDragStart={() => this.onDragChange('start')}
          onDragEnd={() => this.onDragChange('end')}
          maxIncrement={500}
          maxDecrement={0}
        />
      );
    },
  });
</script>
<style scoped lang="scss" module>
  @include b('draggable-line') {
    @include m('right') {
      right: 0;
    }
  }
</style>
