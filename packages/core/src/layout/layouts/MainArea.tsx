import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { Panel, Widget } from '../widget';
import { observer } from '../../obx';

export const MainArea = observer(
  defineComponent({
    name: 'MainArea',
    props: {
      area: {
        type: Object as PropType<Area<any, Panel | Widget>>,
        required: true,
      },
    },
    render() {
      return (
        <div class={classNames('lc-main-area engine-workspacepane')}>
          {this.area.container.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
