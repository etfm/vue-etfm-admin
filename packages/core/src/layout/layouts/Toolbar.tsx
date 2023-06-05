import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';

export const Toolbar = observer(
  defineComponent({
    name: 'Toolbar',
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

      const left: any[] = [];
      const center: any[] = [];
      const right: any[] = [];
      this.area.container.items.forEach((item) => {
        if (item.align === 'center') {
          center.push(item.content);
        } else if (item.align === 'right') {
          right.push(item.content);
        } else {
          left.push(item.content);
        }
      });

      return (
        <div
          class={classNames('lc-toolbar', {
            'lc-area-visible': this.area.visible,
          })}
        >
          <div class="lc-toolbar-left">{left}</div>
          <div class="lc-toolbar-center">{center}</div>
          <div class="lc-toolbar-right">{right}</div>
        </div>
      );
    },
  }),
);
