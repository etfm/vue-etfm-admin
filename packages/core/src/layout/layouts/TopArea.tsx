import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';

export const TopArea = observer(
  defineComponent({
    name: 'TopArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup() {},
    render() {
      const left: any[] = [];
      const center: any[] = [];
      const right: any[] = [];
      this.area.items
        .slice()
        .sort((a, b) => {
          const index1 = a.config?.index || 0;
          const index2 = b.config?.index || 0;
          return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
        })
        .forEach((item) => {
          const content = <div key={`top-area-${item.name}`}>{item.content}</div>;
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
          class={classNames('lc-top-area engine-actionpane', {
            'lc-area-visible': this.area.visible,
          })}
        >
          <div class="lc-top-area-left">{left}</div>
          <div class="lc-top-area-center">{center}</div>
          <div class="lc-top-area-right">{right}</div>
        </div>
      );
    },
  }),
);
