import { IconType, TipContent, TitleContent } from '@elcplat/lowcode-types'
import classNames from 'classnames'
import { defineComponent, PropType, onUpdated, onMounted } from 'vue'
import { SkeletonEvents } from '../../skeleton'
import { composeTitle } from '../../utils'
import { PanelDock } from '../../widget'
import { Title } from '@elcplat/lowcode-components'

export const PanelDockView = defineComponent({
  name: 'PanelDockView',
  props: {
    dock: {
      type: Object as PropType<PanelDock>,
      required: true,
    },
    title: {
      type: [String, Object] as PropType<TitleContent>,
    },
    icon: {
      type: [String, Object] as PropType<IconType>,
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
    },
    description: {
      type: [String, Object] as PropType<TipContent>,
    },
    onClick: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    let lastActived = false

    onMounted(() => {
      checkActived()
    })

    onUpdated(() => {
      checkActived()
    })

    const handleClick = () => {
      props.onClick && props.onClick()
      props.dock.togglePanel()
    }

    const checkActived = () => {
      const { dock } = props
      if (dock.actived !== lastActived) {
        lastActived = dock.actived
        if (lastActived) {
          dock.skeleton.postEvent(
            SkeletonEvents.PANEL_DOCK_ACTIVE,
            dock.name,
            dock
          )
        } else {
          dock.skeleton.postEvent(
            SkeletonEvents.PANEL_DOCK_UNACTIVE,
            dock.name,
            dock
          )
        }
      }
    }

    return {
      handleClick,
    }
  },
  render() {
    return (
      <Title
        title={composeTitle(this.title, this.icon, this.description) as any}
        class={classNames('lc-dock', this.$attrs.class as string, {
          [`lc-dock-${this.size}`]: this.size,
        })}
        onClick={this.handleClick}
      />
    )
  },
})
