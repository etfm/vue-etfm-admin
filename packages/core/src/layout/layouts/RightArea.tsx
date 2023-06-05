import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { Panel } from '../widget';
import { observer } from '../../obx';

export const RightArea = observer(
  defineComponent({
    name: 'RightArea',
    props: {
      area: {
        type: Object as PropType<Area<any, Panel>>,
        required: true,
      },
    },
    render() {
      return (
        <div
          class={classNames('lc-right-area engine-tabpane', {
            'lc-area-visible': this.area.visible,
          })}
        >
          {this.area.container.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
