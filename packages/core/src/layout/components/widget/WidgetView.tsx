import { defineComponent, PropType } from 'vue';
import { observer } from '../../../obx';
import { DraggableLineView } from './DraggableLineView';
import { Widget } from '../../widget';
import { useNamespace } from '@etfma/hooks';
import classnames from 'classnames';
import './index.scss';

export const WidgetView = observer(
  defineComponent({
    name: 'WidgetView',
    props: {
      widget: {
        type: Object as PropType<Widget>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('widget');

      return {
        ns,
      };
    },
    render() {
      const { ns } = this;
      if (!this.widget.visible) {
        return null;
      }
      if (this.widget.disabled) {
        return <div class={classnames(ns.b(), ns.m('disabled'))}>{this.widget.body}</div>;
      }
      return (
        <>
          {this.widget.body}
          {this.widget.config.props?.enableDrag && <DraggableLineView widget={this.widget} />}
        </>
      );
    },
  }),
);
