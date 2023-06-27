import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';
import { useNamespace } from '@etfma/hooks';

export const AsideArea = observer(
  defineComponent({
    name: 'AsideArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('aside-area');

      return {
        ns,
      };
    },
    render() {
      const { ns, area } = this;
      const top: any[] = [];
      const bottom: any[] = [];
      area.items
        .slice()
        .sort((a, b) => {
          const index1 = a.config?.index || 0;
          const index2 = b.config?.index || 0;
          return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
        })
        .forEach((item) => {
          const content = <div key={ns.b(`${item.align}-${item.name}`)}>{item.content}</div>;
          if (item.align === 'bottom') {
            bottom.push(content);
          } else {
            top.push(content);
          }
        });

      return (
        <div
          class={classNames(ns.b(), {
            [ns.is('visible')]: area.visible,
          })}
        >
          <div class={classNames(ns.b('top'))}>{top}</div>
          <div class={classNames(ns.b('bottom'))}>{bottom}</div>
        </div>
      );
    },
  }),
);
