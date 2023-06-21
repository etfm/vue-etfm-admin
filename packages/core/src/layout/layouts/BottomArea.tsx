import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';

export const BottomArea = observer(
  defineComponent({
    name: 'BottomArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    render() {
      if (this.area.isEmpty()) {
        return null;
      }
      return (
        <div
          class={classNames('lc-bottom-area', {
            'lc-area-visible': this.area.visible,
          })}
        >
          {this.area.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
