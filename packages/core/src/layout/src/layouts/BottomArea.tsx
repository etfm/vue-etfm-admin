import classNames from 'classnames'
import { defineComponent, PropType } from 'vue'
import { Area } from '../area'
import { Panel } from '../widget'
import { observer } from '@elcplat/lowcode-core'

export const BottomArea = observer(
  defineComponent({
    name: 'BottomArea',
    props: {
      area: {
        type: Object as PropType<Area<any, Panel>>,
        required: true,
      },
    },
    render() {
      if (this.area.isEmpty()) {
        return null
      }
      return (
        <div
          class={classNames('lc-bottom-area', {
            'lc-area-visible': this.area.visible,
          })}
        >
          {this.area.container.items.map((item) => item.content)}
        </div>
      )
    },
  })
)
