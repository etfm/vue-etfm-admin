import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';

export const MainArea = observer(
  defineComponent({
    name: 'MainArea',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    render() {
      return (
        <div class={classNames('lc-main-area engine-workspacepane')}>
          {this.area.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
