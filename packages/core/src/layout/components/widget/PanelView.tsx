import { defineComponent, PropType, onMounted, onUpdated } from 'vue';
import { Panel } from '../../widget';
import { SkeletonEvents } from '../../skeleton';
import { observer } from '../../../obx';
import classNames from 'classnames';
import { PanelOperationRow } from './PanelOperationRow';
import { DraggableLineView } from './DraggableLineView';
import { globalContext } from '../../../di';
import { Editor } from '../../../core/core';

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
      hideOperationRow: {
        type: Boolean,
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
            // FIXME! remove this line
            panel.skeleton.postEvent('leftPanel.show' as any, panel.name, panel);
          } else {
            panel.skeleton.postEvent(SkeletonEvents.PANEL_HIDE, panel.name, panel);
            // FIXME! remove this line
            panel.skeleton.postEvent('leftPanel.hide' as any, panel.name, panel);
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
          {!this.hideOperationRow && <PanelOperationRow panel={this.panel} />}
          <div class="lc-panel-body">{this.panel.body}</div>
          {!this.hideDragLine && <DraggableLineView panel={this.panel} />}
        </div>
      );
    },
  }),
);
