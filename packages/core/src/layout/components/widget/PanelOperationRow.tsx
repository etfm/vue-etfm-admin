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

    let canSetFixed = true;
    if (this.panel?.config.props?.canSetFixed === false) {
      canSetFixed = false;
    }

    const areaName = this.panel?.parent?.name as string;

    return (
      <Fragment>
        {canSetFixed && (
          <div class="lc-pane-icon-fix" onClick={this.setDisplay}>
            {areaName === 'leftFloatArea' ? <IconFix /> : <IconFloat />}
          </div>
        )}
      </Fragment>
    );
  },
});
