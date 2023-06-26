import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';
import { useNamespace } from '@etfma/hooks';

export const TopArea = observer(
  defineComponent({
    name: 'TopArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('top-area');

      return { ns };
    },
    render() {
      const { ns, area } = this;
      const left: any[] = [];
      const center: any[] = [];
      const right: any[] = [];
      area.items
        .slice()
        .sort((a, b) => {
          const index1 = a.config?.index || 0;
          const index2 = b.config?.index || 0;
          return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
        })
        .forEach((item) => {
          const content = <div key={ns.b(`${item.align}-${item.name}`)}>{item.content}</div>;
          if (item.align === 'center') {
            center.push(content);
          } else if (item.align === 'left') {
            left.push(content);
          } else {
            right.push(content);
          }
        });

      return (
        <div
          class={classNames(ns.b(), {
            [ns.is('visible')]: this.area.visible,
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
