import { defineComponent, onMounted, onUpdated, PropType } from 'vue';
import { observer } from '../../../obx';
import { SkeletonEvents } from '@etfma/types';
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
    setup(props) {
      let lastVisible = false;
      let lastDisabled = false;

      onMounted(() => {
        checkVisible();
        checkDisabled();
      });

      onUpdated(() => {
        checkVisible();
        checkDisabled();
      });

      const checkVisible = () => {
        const { widget } = props;
        const currentVisible = widget.visible;

        if (currentVisible !== lastVisible) {
          lastVisible = currentVisible;
          if (lastVisible) {
            widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
          } else {
            widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
          }
        }
      };

      const checkDisabled = () => {
        const { widget } = props;
        const currentDisabled = widget.disabled ?? false;
        if (currentDisabled !== lastDisabled) {
          lastDisabled = currentDisabled;
          if (lastDisabled) {
            widget.skeleton.postEvent(SkeletonEvents.WIDGET_DISABLE, widget.name, widget);
          } else {
            widget.skeleton.postEvent(SkeletonEvents.WIDGET_ENABLE, widget.name, widget);
          }
        }
      };
    },
    render() {
      if (!this.widget.visible) {
        return null;
      }
      if (this.widget.disabled) {
        return <div class="lc-widget-disabled">{this.widget.body}</div>;
      }
      // return this.widget.body;
      return (
        <div
          class="lc-widget"
          id={this.widget.name}
          data-keep-visible-while-dragging={this.widget.config.props?.keepVisibleWhileDragging}
        >
          {this.widget.body}
          {this.widget.config.props?.enableDrag && <DraggableLineView widget={this.widget} />}
        </div>
      );
    },
  }),
);
