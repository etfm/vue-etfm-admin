import { defineComponent, PropType, onMounted, onUpdated } from 'vue';
import { Panel } from '../../widget';
import { observer } from '../../../obx';
import classNames from 'classnames';
import { DraggableLineView } from './DraggableLineView';
import { SkeletonEvents } from '@etfma/types';

/// 需要保留 不带任何组件
export const PanelView = observer(
  defineComponent({
    name: 'PanelView',
    props: {
      panel: {
        type: Object as PropType<Panel>,
        required: true,
      },
      area: {
        type: String,
      },
      hideDragLine: {
        type: Boolean,
      },
    },
    setup(props) {
      let lastVisible = false;

      onMounted(() => {
        checkVisible();
      });

      onUpdated(() => {
        checkVisible();
      });

      const checkVisible = () => {
        const { panel } = props;
        const currentVisible = panel.inited && panel.visible;
        if (currentVisible !== lastVisible) {
          lastVisible = currentVisible;
          if (lastVisible) {
            panel.skeleton.postEvent(SkeletonEvents.PANEL_SHOW, panel.name, panel);
          } else {
            panel.skeleton.postEvent(SkeletonEvents.PANEL_HIDE, panel.name, panel);
          }
        }
      };
    },
    render() {
      if (!this.panel.inited) {
        return null;
      }
      const editor = this.panel.skeleton.editor;
      const panelName = this.area ? `${this.area}-${this.panel.name}` : this.panel.name;
      editor?.emit('skeleton.panel.toggle', {
        name: panelName || '',
        status: this.panel.visible ? 'show' : 'hide',
      });

      return (
        <div
          class={classNames('lc-panel', {
            hidden: !this.panel.visible,
          })}
          id={panelName}
          data-keep-visible-while-dragging={this.panel.config.props?.keepVisibleWhileDragging}
        >
          <div class="lc-panel-body">{this.panel.body}</div>
          {!this.hideDragLine && <DraggableLineView panel={this.panel} />}
        </div>
      );
    },
  }),
);
