import classNames from 'classnames'
import { defineComponent, PropType } from 'vue'
import { Area } from '../area'
import { observer } from '@elcplat/lowcode-core'

export const LeftArea = observer(
  defineComponent({
    name: 'LeftArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    render() {
      const top: any[] = []
      const bottom: any[] = []
      this.area.container.items
        .slice()
        .sort((a, b) => {
          const index1 = a.config?.index || 0
          const index2 = b.config?.index || 0
          return index1 === index2 ? 0 : index1 > index2 ? 1 : -1
        })
        .forEach((item) => {
          const content = (
            <div key={`left-area-${item.name}`}>{item.content}</div>
          )
          if (item.align === 'bottom') {
            bottom.push(content)
          } else {
            top.push(content)
          }
        })
      return (
        <div
          class={classNames('lc-left-area', {
            'lc-area-visible': this.area.visible,
          })}
        >
          <div class="lc-left-area-top">{top}</div>
          <div class="lc-left-area-bottom">{bottom}</div>
        </div>
      )
    },
  })
)
