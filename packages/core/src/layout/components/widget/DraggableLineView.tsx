import { defineComponent, PropType, ref, unref } from 'vue';
import { Widget } from '../../widget';
import { DraggableLine } from '../draggable-line';

export const DraggableLineView = defineComponent({
  name: 'DraggableLineView',
  props: {
    widget: {
      type: Object as PropType<Widget>,
      required: true,
    },
  },
  setup(props) {
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

      // 抛出事件，对于有些需要 panel 插件随着 度变化进行再次渲染的，由panel插件内部监听事件实现
      const editor = props.widget.skeleton.editor;
      editor?.eventBus.emit('dockpane.drag', width);
    };

    const onDragChange = (type: 'start' | 'end') => {
      const editor = props.widget.skeleton.editor;
      editor?.eventBus.emit('dockpane.dragchange', type);
      // builtinSimulator 屏蔽掉 鼠标事件
      editor?.eventBus.emit('designer.builtinSimulator.disabledEvents', type === 'start');
    };

    return {
      onDrag,
      onDragChange,
      shell,
    };
  },
  render() {
    const isRightArea = this.widget.config?.area === 'rightArea';
    if (isRightArea) {
      return null;
    }
    return (
      <DraggableLine
        ref={(ref) => {
          this.shell = ref as any;
        }}
        position="right"
        class="lc-engine-slate-draggable-line-right"
        onDrag={(e) => this.onDrag(e)}
        onDragStart={() => this.onDragChange('start')}
        onDragEnd={() => this.onDragChange('end')}
        maxIncrement={500}
        maxDecrement={0}
        // TODO: 优化
        // maxIncrement={dock.getMaxWidth() - this.cachedSize.width}
        // maxDecrement={this.cachedSize.width - dock.getWidth()}
      />
    );
  },
});
