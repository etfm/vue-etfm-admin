import { Editor, globalContext, observer } from '@elcplat/lowcode-core';
import classNames from 'classnames';
import { defineComponent, PropType, onMounted, onUpdated, ref } from 'vue';
import { SkeletonEvents } from '../../skeleton';
import { Panel } from '../../widget';
import { DraggableLineView } from './DraggableLineView';
import { PanelOperationRow } from './PanelOperationRow';
import { PanelTitle } from './PanelTitle';

//不需要
export const TitledPanelView = observer(
  defineComponent({
    name: 'TitledPanelView',
    props: {
      panel: {
        type: Object as PropType<Panel>,
        required: true,
      },
      area: {
        type: String,
      },
    },
    setup(props) {
      const lastVisible = ref(false);

      onMounted(() => {
        checkVisible();
      });
      onUpdated(() => {
        checkVisible();
      });

      const checkVisible = () => {
        const { panel } = props;
        const currentVisible = panel.inited && panel.visible;
        if (currentVisible !== lastVisible.value) {
          lastVisible.value = currentVisible;
          if (lastVisible.value) {
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
      const editor = globalContext.get(Editor);
      const panelName = this.area ? `${this.area}-${this.panel.name}` : this.panel.name;
      editor?.emit('skeleton.panel.toggle', {
        name: panelName || '',
        status: this.panel.visible ? 'show' : 'hide',
      });
      return (
        <div
          class={classNames('lc-titled-panel', {
            hidden: !this.panel.visible,
          })}
          id={panelName}
          data-keep-visible-while-dragging={this.panel.config.props?.keepVisibleWhileDragging}
        >
          <PanelOperationRow panel={this.panel} />
          <PanelTitle panel={this.panel} />
          <div class="lc-panel-body">{this.panel.body}</div>
          <DraggableLineView panel={this.panel} />
        </div>
      );
    },
  }),
);
