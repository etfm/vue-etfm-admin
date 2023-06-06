import { defineComponent, Fragment, PropType } from 'vue';
import { Panel } from '../../widget';
import { IconFix } from '../../icons/fix';
import { IconFloat } from '../../icons/float';

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
      const { panel } = props;
      const current = panel;
      if (!current) {
        return;
      }

      panel.skeleton.toggleFloatStatus(panel);
    };

    return {
      setDisplay,
    };
  },
  render() {
    const isRightArea = this.panel.config?.area === 'rightArea';
    if (isRightArea) {
      return null;
    }

    const hideTitleBar = this.panel?.config.props?.hideTitleBar;

    const areaName = this.panel?.parent?.name;
    const area = this.panel.skeleton[areaName];

    return (
      <Fragment>
        {!hideTitleBar && (
          <Fragment>
            <div text class="lc-pane-icon-fix" onClick={this.setDisplay}>
              {areaName === 'leftFloatArea' ? <IconFix /> : <IconFloat />}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  },
});
