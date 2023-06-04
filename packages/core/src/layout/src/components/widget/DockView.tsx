import { IconType, TipContent, TitleContent } from '@elcplat/lowcode-types'
import classNames from 'classnames'
import { defineComponent, PropType } from 'vue'
import { composeTitle } from '../../utils'
import { Title } from '@elcplat/lowcode-components'

export const DockView = defineComponent({
  name: 'DockView',
  props: {
    title: {
      type: [String, Object] as PropType<TitleContent>,
      required: true,
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
    const title = composeTitle(props.title, props.icon, props.description)
    return {
      title,
    }
  },
  render() {
    return (
      <Title
        title={this.title}
        class={classNames('lc-dock', {
          [`lc-dock-${this.size}`]: this.size,
        })}
        onClick={this.onClick}
      />
    )
  },
})
