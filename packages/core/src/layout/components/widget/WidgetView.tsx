import { defineComponent, onMounted, onUpdated, PropType } from 'vue';
import { observer } from '../../../obx';
import { IWidget, SkeletonEvents } from '@etfma/types';

export const WidgetView = observer(
  defineComponent({
    name: 'WidgetView',
    props: {
      widget: {
        type: Object as PropType<IWidget>,
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
      return this.widget.body;
    },
  }),
);
