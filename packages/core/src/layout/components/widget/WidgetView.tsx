import { defineComponent, PropType } from 'vue';
import { observer } from '../../../obx';
import { DraggableLineView } from './DraggableLineView';
import { Widget } from '../../widget';

export const WidgetView = observer(
  defineComponent({
    name: 'WidgetView',
    props: {
      widget: {
        type: Object as PropType<Widget>,
        required: true,
      },
    },
    render() {
      if (!this.widget.visible) {
        return null;
      }
      if (this.widget.disabled) {
        return <div class="lc-widget-disabled">{this.widget.body}</div>;
      }
      return (
        <>
          <div
            class="lc-widget"
            id={this.widget.name}
            data-keep-visible-while-dragging={this.widget.config.props?.keepVisibleWhileDragging}
          >
            {this.widget.body}
          </div>
          {this.widget.config.props?.enableDrag && <DraggableLineView widget={this.widget} />}
        </>
      );
    },
  }),
);
