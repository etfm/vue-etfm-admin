import { defineComponent, PropType, VNode } from 'vue'
import { Panel, WidgetContainer } from '../../widget'
import { PanelTitle } from './PanelTitle'
import { PanelView } from './PanelView'
import { observer } from '@elcplat/lowcode-core'

export const TabsPanelView = observer(
  defineComponent({
    name: 'TabsPanelView',
    props: {
      container: {
        type: Object as PropType<WidgetContainer<Panel>>,
        required: true,
      },
    },
    setup() {
      return {}
    },
    render() {
      const titles: VNode[] = []
      const contents: VNode[] = []
      this.container.items.forEach((item: any) => {
        titles.push(
          <PanelTitle key={item.id} panel={item} class="lc-tab-title" />
        )
        contents.push(
          <PanelView key={item.id} panel={item} hideOperationRow hideDragLine />
        )
      })
      return {}
    },
  })
)
