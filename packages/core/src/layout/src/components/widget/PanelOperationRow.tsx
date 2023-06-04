import { defineComponent, Fragment, PropType } from 'vue'
import { Panel } from '../../widget'
import { NButton } from 'naive-ui'
import { Icon } from '@elcplat/lowcode-components'
import { IconFix } from '../../icons/fix'
import { IconFloat } from '../../icons/float'

export const PanelOperationRow = defineComponent({
  name: 'PanelOperationRow',
  props: {
    panel: {
      type: Object as PropType<Panel>,
      required: true,
    },
  },
  setup(props) {
    const setDisplay = () => {
      const { panel } = props
      const current = panel
      if (!current) {
        return
      }

      panel.skeleton.toggleFloatStatus(panel)
    }

    return {
      setDisplay,
    }
  },
  render() {
    const isRightArea = this.panel.config?.area === 'rightArea'
    if (isRightArea) {
      return null
    }

    const hideTitleBar = this.panel?.config.props?.hideTitleBar

    const areaName = this.panel?.parent?.name
    const area = this.panel.skeleton[areaName]

    return (
      <Fragment>
        {!hideTitleBar && (
          <Fragment>
            <NButton text class="lc-pane-icon-fix" onClick={this.setDisplay}>
              {areaName === 'leftFloatArea' ? <IconFix /> : <IconFloat />}
            </NButton>

            <NButton
              text
              class="lc-pane-icon-close"
              onClick={() => {
                area && area.setVisible(false)
              }}
            >
              <Icon type="ion:close-outline" />
            </NButton>
          </Fragment>
        )}
      </Fragment>
    )
  },
})
