import classNames from 'classnames';
import { defineComponent, PropType, onUpdated } from 'vue';
import { Area } from '../area';
import { observer } from '../../obx';

export const LeftFixedPane = observer(
  defineComponent({
    name: 'LeftFixedPane',
    props: {
      area: {
        type: Object as PropType<Area>,
        required: true,
      },
    },
    setup(props) {
      onUpdated(() => {
        props.area.skeleton.editor.get('designer')?.touchOffsetObserver();
      });
    },
    render() {
      const width = this.area?.config.props?.width;
      const style = width
        ? {
            width,
          }
        : undefined;

      return (
        <div
          class={classNames('lc-left-fixed-pane', {
            'lc-area-visible': this.area.visible,
          })}
          style={style}
        >
          {this.area.container.items.map((item) => item.content)}
        </div>
      );
    },
  }),
);
