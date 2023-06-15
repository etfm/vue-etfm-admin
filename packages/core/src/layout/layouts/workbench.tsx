import { defineComponent, PropType } from 'vue';
import { Skeleton } from '../skeleton';
import './workbench.less';
import classNames from 'classnames';
import { TopArea } from './TopArea';
import { LeftArea } from './LeftArea';
import { LeftFloatPane } from './LeftFloatPane';
import { LeftFixedPane } from './LeftFixedPane';
import { Toolbar } from './Toolbar';
import { RightArea } from './RightArea';
import { MainArea } from './MainArea';
import { BottomArea } from './BottomArea';
import { observer } from '../../obx';

export const Workbench = observer(
  defineComponent({
    name: 'Workbench',
    props: {
      skeleton: {
        type: Object as PropType<Skeleton>,
        required: true,
      },
    },
    setup(props) {
      const { skeleton } = props;

      return {
        skeleton,
      };
    },
    render() {
      return (
        <div class={classNames('lc-workbench', this.$attrs.class as any)}>
          <TopArea area={this.skeleton.topArea} />
          <div class="lc-workbench-body">
            <LeftArea area={this.skeleton.leftArea} />
            <LeftFloatPane area={this.skeleton.leftFloatArea} />
            <LeftFixedPane area={this.skeleton.leftFixedArea} />
            <div class="lc-workbench-center">
              <Toolbar area={this.skeleton.toolbar} />
              <MainArea area={this.skeleton.mainArea} />
              <BottomArea area={this.skeleton.bottomArea} />
            </div>
            <RightArea area={this.skeleton.rightArea} />
          </div>
        </div>
      );
    },
  }),
);
