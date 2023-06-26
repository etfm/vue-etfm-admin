import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';
import { useNamespace } from '@etfma/hooks';

export const RightArea = observer(
  defineComponent({
    name: 'RightArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('right-area');

      return {
        ns,
      };
    },
    render() {
      const { ns, area } = this;
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
