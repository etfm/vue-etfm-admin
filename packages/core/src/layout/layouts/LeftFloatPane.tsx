import { observer } from '../../obx';
import classNames from 'classnames';
import { defineComponent, PropType, onMounted, ref, unref, onUnmounted, onUpdated } from 'vue';
import { Area } from '../area';
import { Panel } from '../widget';
import { Focusable, focusTracker } from '../../utils';

export const LeftFloatPane = observer(
  defineComponent({
    name: 'LeftFloatPane',
    props: {
      area: {
        type: Object as PropType<Area<any, Panel>>,
        required: true,
      },
    },
    setup(props) {
      let dispose: () => void;
      let focusing: Focusable;

      const shell = ref<HTMLElement | null>(null);

      onMounted(() => {
        props.area.skeleton.editor.eventBus.on('designer.drag', triggerClose);

        dispose = () => {
          props.area.skeleton.editor.eventBus.removeListener('designer.drag', triggerClose);
        };

        focusing = focusTracker.create({
          range: (e) => {
            const target = e.target as HTMLElement;
            if (!target) {
              return false;
            }
            if (unref(shell)?.contains(target)) {
              return true;
            }
            // 点击了 iframe 内容，算失焦
            if (
              (
                document.querySelector('.lc-simulator-content-frame') as HTMLIFrameElement
              )?.contentWindow?.document.documentElement.contains(target)
            ) {
              return false;
            }
            // 点击设置区
            if (document.querySelector('.lc-right-area')?.contains(target)) {
              return false;
            }
            // 点击非编辑区域的popup/dialog,插件栏左侧等不触发失焦
            if (!document.querySelector('.lc-workbench')?.contains(target)) {
              return true;
            }
            // 排除设置区，iframe 之后，都不算失焦
            if (document.querySelector('.lc-workbench-body')?.contains(target)) {
              return true;
            }
            const docks = props.area.current?.getAssocDocks();
            if (docks && docks?.length) {
              return docks.some((dock) => (dock.getDOMNode() as any)?.$el?.contains(target));
            }
            return false;
          },
          onEsc: () => {
            props.area.setVisible(false);
          },
          onBlur: () => {
            // debugger
            props.area.setVisible(false);
          },
        });

        onEffect();
      });

      const onEffect = () => {
        if (props.area.visible) {
          focusing?.active();
          // 关闭当前fixed区域的面板
          // TODO: 看看有没有更合适的地方
          const fixedContainer = props.area?.skeleton?.leftFixedArea?.container;
          const currentFixed = fixedContainer?.current;
          if (currentFixed) {
            fixedContainer.unactive(currentFixed);
          }
        } else {
          focusing?.suspense();
        }
      };

      onUpdated(() => {
        onEffect();
      });

      const triggerClose = (e: any) => {
        if (!props.area.visible) return;
        // 当 MouseEvent 的 target 为「插入占位符」时，不关闭当前 panel
        if (e.originalEvent?.target?.classList.contains('insertion')) return;
        // 假如当前操作 target 祖先节点中有属性 data-keep-visible-while-dragging="true" 代表该 target 所属 panel
        // 不希望 target 在 panel 范围内拖拽时关闭 panel
        const panelElem = e.originalEvent?.target.closest(
          'div[data-keep-visible-while-dragging="true"]',
        );
        if (panelElem) return;
        props.area.setVisible(false);
      };

      onUnmounted(() => {
        focusing?.purge();
        dispose?.();
      });

      return {
        shell,
      };
    },
    render() {
      const width = this.area.current?.config.props?.width;

      const style = width
        ? {
            width,
          }
        : undefined;

      return (
        <div
          ref={(ref) => {
            this.shell = ref as any;
          }}
          class={classNames('lc-left-float-pane', {
            'lc-area-visible': this.area.visible,
          })}
          style={style}
        >
          {this.area.container.items.map((panel) => panel.content)}
        </div>
      );
    },
  }),
);
