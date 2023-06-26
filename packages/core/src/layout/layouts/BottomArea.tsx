import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';
import { useNamespace } from '@etfma/hooks';

export const BottomArea = observer(
  defineComponent({
    name: 'BottomArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('bottom-area');
      return {
        ns,
      };
    },
    render() {
      const { ns, area } = this;
      if (area.isEmpty()) {
        return null;
      }
      return (
        <div
          class={classNames(ns.b(), {
            [ns.is('visible')]: area.visible,
          })}
        >
          {area.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
