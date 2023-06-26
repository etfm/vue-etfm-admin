import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';
import { useNamespace } from '@etfma/hooks';

export const Toolbar = observer(
  defineComponent({
    name: 'Toolbar',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('toolbar');

      return { ns };
    },
    render() {
      const { ns, area } = this;
      if (area.isEmpty()) {
        return null;
      }

      const left: any[] = [];
      const center: any[] = [];
      const right: any[] = [];
      area.items.forEach((item) => {
        const content = <div key={ns.b(`${item.align}-${item.name}`)}>{item.content}</div>;
        if (item.align === 'center') {
          center.push(content);
        } else if (item.align === 'right') {
          right.push(content);
        } else {
          left.push(content);
        }
      });

      return (
        <div
          class={classNames(ns.b(), {
            [ns.is('visible')]: area.visible,
          })}
        >
          <div class={classNames(ns.b('left'))}>{left}</div>
          <div class={classNames(ns.b('center'))}>{center}</div>
          <div class={classNames(ns.b('right'))}>{right}</div>
        </div>
      );
    },
  }),
);
