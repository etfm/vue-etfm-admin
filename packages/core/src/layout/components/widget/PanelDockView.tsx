import { defineComponent, PropType, onUpdated, onMounted, ref } from 'vue';
import { PanelDock } from '../../widget/panel-dock';
import { SkeletonEvents } from '../../skeleton';

export const PanelDockView = defineComponent({
  name: 'PanelDockView',
  props: {
    dock: {
      type: Object as PropType<PanelDock>,
      required: true,
    },
    onClick: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    let lastActived = ref(false);
    const lastVisible = ref(false);
    const lastDisabled = ref(false);

    onMounted(() => {
      checkDisabled();
      checkActived();
      checkActived();
    });

    onUpdated(() => {
      checkVisible();
      checkVisible();
      checkDisabled();
    });

    const checkActived = () => {
      const { dock } = props;
      if (dock.actived !== lastActived.value) {
        lastActived.value = dock.actived;
        if (lastActived) {
          dock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_ACTIVE, dock.name, dock);
        } else {
          dock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_UNACTIVE, dock.name, dock);
        }
      }
    };

    const checkVisible = () => {
      const { dock } = props;
      const currentVisible = dock.visible;

      if (currentVisible !== lastVisible.value) {
        lastVisible.value = currentVisible;
        if (lastVisible.value) {
          dock.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, dock.name, dock);
        } else {
          dock.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, dock.name, dock);
        }
      }
    };

    const checkDisabled = () => {
      const { dock } = props;
      const currentDisabled = dock.disabled ?? false;
      if (currentDisabled !== lastDisabled.value) {
        lastDisabled.value = currentDisabled;
        if (lastDisabled.value) {
          dock.skeleton.postEvent(SkeletonEvents.WIDGET_DISABLE, dock.name, dock);
        } else {
          dock.skeleton.postEvent(SkeletonEvents.WIDGET_ENABLE, dock.name, dock);
        }
      }
    };
  },
  render() {
    if (!this.dock.visible) {
      return null;
    }
    if (this.dock.disabled) {
      return <div class="lc-widget-disabled">{this.dock.body}</div>;
    }
    return this.dock.body;
  },
});
