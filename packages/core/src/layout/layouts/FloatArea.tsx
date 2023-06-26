import { observer } from '../../obx';
import classNames from 'classnames';
import { defineComponent, PropType, onMounted, ref, unref, onUnmounted, onUpdated } from 'vue';
import { Area } from '../area';
import { Focusable, focusTracker } from '../../utils';
import { useNamespace } from '@etfma/hooks';

export const FloatArea = observer(
  defineComponent({
    name: 'FloatArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup(props) {
      const ns = useNamespace('float-area');
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
            if (document.querySelector(`.${ns.namespace.value}-right-area`)?.contains(target)) {
              return false;
            }

            // 点击左侧不算失焦
            if (document.querySelector(`.${ns.namespace.value}-left-area`)?.contains(target)) {
              return true;
            }

            if (!document.querySelector(`.${ns.namespace.value}-workbench`)?.contains(target)) {
              return true;
            }

            if (document.querySelector(`.${ns.namespace.value}-workbench-body`)?.contains(target)) {
              return false;
            }

            return false;
          },
          onEsc: () => {
            props.area.setVisible(false);
          },
          onBlur: () => {
            props.area.setVisible(false);
          },
        });

        onEffect();
      });

      const onEffect = () => {
        if (props.area.visible) {
          focusing?.active();
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
        ns,
      };
    },
    render() {
      const { ns, area } = this;
      const width = area?.config?.props?.width;

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
          class={classNames(ns.b(), {
            [ns.is('visible')]: area.visible,
          })}
          style={style}
        >
          {area.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
