import { Editor, globalContext } from '@elcplat/lowcode-core'
import { defineComponent, PropType, ref, unref } from 'vue'
import { Panel } from '../../widget'
import { DraggableLine } from '../draggable-line'

export const DraggableLineView = defineComponent({
  name: 'DraggableLineView',
  props: {
    panel: {
      type: Object as PropType<Panel>,
      required: true,
    },
  },
  setup(props) {
    const shell = ref()
    const defaultWidth = ref(0)

    const getDefaultWidth = () => {
      const configWidth = props.panel?.config.props?.width
      if (configWidth) {
        return configWidth
      }
      if (defaultWidth.value) {
        return defaultWidth.value
      }
      const containerRef = unref(shell)?.getParent()
      if (containerRef) {
        defaultWidth.value = containerRef.offsetWidth
        return defaultWidth.value
      }
      return 300
    }

    const onDrag = (value: number) => {
      const defaultWidth = getDefaultWidth()
      const width = defaultWidth + value

      const containerRef = unref(shell)?.getParent()
      if (containerRef) {
        containerRef.style.width = `${width}px`
      }

      // 抛出事件，对于有些需要 panel 插件随着 度变化进行再次渲染的，由panel插件内部监听事件实现
      const editor = globalContext.get(Editor)
      editor?.emit('dockpane.drag', width)
    }

    const onDragChange = (type: 'start' | 'end') => {
      const editor = globalContext.get(Editor)
      editor?.emit('dockpane.dragchange', type)
      // builtinSimulator 屏蔽掉 鼠标事件
      editor?.emit('designer.builtinSimulator.disabledEvents', type === 'start')
    }

    return {
      onDrag,
      onDragChange,
      shell,
    }
  },
  render() {
    // left fixed 下不允许改变宽度
    // 默认 关闭，通过配置开启
    const enableDrag = this.panel.config.props?.enableDrag
    const isRightArea = this.panel.config?.area === 'rightArea'
    if (
      isRightArea ||
      !enableDrag ||
      this.panel?.parent?.name === 'leftFixedArea'
    ) {
      return null
    }
    return (
      <DraggableLine
        ref={(ref) => {
          this.shell = ref as any
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
    )
  },
})
