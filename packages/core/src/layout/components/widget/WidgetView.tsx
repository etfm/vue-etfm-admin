import { defineComponent, onMounted, onUpdated, PropType, ref } from 'vue';
import { observer } from '../../../obx';

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
      const lastVisible = ref(false);
      const lastDisabled = ref(false);

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

        if (currentVisible !== lastVisible.value) {
          lastVisible.value = currentVisible;
          if (lastVisible.value) {
            widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
          } else {
            widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
          }
        }
      };

      const checkDisabled = () => {
        const { widget } = props;
        const currentDisabled = widget.disabled ?? false;
        if (currentDisabled !== lastDisabled.value) {
          lastDisabled.value = currentDisabled;
          if (lastDisabled.value) {
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
