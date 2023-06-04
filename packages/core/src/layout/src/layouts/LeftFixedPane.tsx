import classNames from 'classnames'
import { defineComponent, PropType, onUpdated } from 'vue'
import { Area } from '../area'
import { PanelConfig } from '../types'
import { Panel } from '../widget'
import { observer } from '@elcplat/lowcode-core'

export const LeftFixedPane = observer(
  defineComponent({
    name: 'LeftFixedPane',
    props: {
      area: {
        type: Object as PropType<Area<PanelConfig, Panel>>,
        required: true,
      },
    },
    setup(props) {
      onUpdated(() => {
        props.area.skeleton.editor.get('designer')?.touchOffsetObserver()
      })
    },
    render() {
      const width = this.area.current?.config.props?.width
      const style = width
        ? {
            width,
          }
        : undefined

      return (
        <div
          class={classNames('lc-left-fixed-pane', {
            'lc-area-visible': this.area.visible,
          })}
          style={style}
        >
          {this.area.container.items.map((panel) => panel.content)}
        </div>
      )
    },
  })
)
