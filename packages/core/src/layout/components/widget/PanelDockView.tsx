import { defineComponent, PropType, onUpdated, onMounted, ref } from 'vue';
import { SkeletonEvents } from '../../skeleton';
import { IPublicTypePanelDockProps } from '../../../types/widget-base-config';

export const PanelDockView = defineComponent({
  name: 'PanelDockView',
  props: {
    panelDock: {
      type: Object as PropType<IPublicTypePanelDockProps>,
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
      const { panelDock } = props;
      if (panelDock.actived !== lastActived.value) {
        lastActived.value = panelDock.actived;
        if (lastActived) {
          panelDock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_ACTIVE, panelDock.name, panelDock);
        } else {
          panelDock.skeleton.postEvent(
            SkeletonEvents.PANEL_DOCK_UNACTIVE,
            panelDock.name,
            panelDock,
          );
        }
      }
    };

    const checkVisible = () => {
      const { panelDock } = props;
      const currentVisible = panelDock.visible;

      if (currentVisible !== lastVisible.value) {
        lastVisible.value = currentVisible;
        if (lastVisible.value) {
          panelDock.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, panelDock.name, panelDock);
        } else {
          panelDock.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, panelDock.name, panelDock);
        }
      }
    };

    const checkDisabled = () => {
      const { panelDock } = props;
      const currentDisabled = panelDock.disabled ?? false;
      if (currentDisabled !== lastDisabled.value) {
        lastDisabled.value = currentDisabled;
        if (lastDisabled.value) {
          panelDock.skeleton.postEvent(SkeletonEvents.WIDGET_DISABLE, panelDock.name, panelDock);
        } else {
          panelDock.skeleton.postEvent(SkeletonEvents.WIDGET_ENABLE, panelDock.name, panelDock);
        }
      }
    };
  },
  render() {
    if (!this.panelDock.visible) {
      return null;
    }
    if (this.panelDock.disabled) {
      return <div class="lc-widget-disabled">{this.panelDock.body}</div>;
    }
    return this.panelDock.body;
  },
});
