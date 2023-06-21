import { observer } from '../../obx';
import classNames from 'classnames';
import { defineComponent, PropType, onMounted, ref, unref, onUnmounted, onUpdated } from 'vue';
import { Area } from '../area';
import { Focusable, focusTracker } from '../../utils';

export const LeftFloatPane = observer(
  defineComponent({
    name: 'LeftFloatPane',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup(props) {
      let focusing: Focusable;

      const shell = ref<HTMLElement | null>(null);

      onMounted(() => {
        focusing = focusTracker.create({
          range: (e) => {
            const target = e.target as HTMLElement;
            if (!target) {
              return false;
            }
            if (unref(shell)?.contains(target)) {
              return true;
            }

            // 点击设置区
            if (document.querySelector('.lc-right-area')?.contains(target)) {
              return false;
            }
            // 点击非编辑区域的popup/dialog,插件栏左侧等不触发失焦
            if (!document.querySelector('.lc-workbench')?.contains(target)) {
              return false;
            }
            // 排除设置区，iframe 之后，都不算失焦
            if (document.querySelector('.lc-workbench-body')?.contains(target)) {
              return false;
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

      onUnmounted(() => {
        focusing?.purge();
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
