import classNames from 'classnames';
import { defineComponent, PropType } from 'vue';
import { Panel } from '../../widget';
import { Icon, Tip, Title } from '@elcplat/lowcode-components';
import { observer } from '@elcplat/lowcode-core';

//不需要
export const PanelTitle = observer(
  defineComponent({
    name: 'PanelTitle',
    props: {
      panel: {
        type: Object as PropType<Panel>,
        required: true,
      },
    },
    setup() {},
    render() {
      const HelpTip = ({ tip }: any) => {
        if (tip && tip.url) {
          return (
            <div>
              <a href={tip.url} target="_blank" rel="noopener noreferrer">
                <Icon type="help" size="small" class="lc-help-tip" />
              </a>
              <Tip>{tip.content}</Tip>
            </div>
          );
        }
        return (
          <div>
            <Icon type="help" size="small" class="lc-help-tip" />
            <Tip>{tip.content}</Tip>
          </div>
        );
      };

      return (
        <div
          class={classNames('lc-panel-title', this.$attrs.class as string, {
            actived: this.panel.actived,
          })}
          data-name={this.panel.name}
        >
          <Title title={this.panel.title || this.panel.name} />
          {this.panel.help ? <HelpTip tip={this.panel.help} /> : null}
        </div>
      );
    },
  }),
);
