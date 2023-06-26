import { defineComponent, PropType } from 'vue';
import { Skeleton } from '../skeleton';
import '../../styles/index.scss';
import classNames from 'classnames';
import { TopArea } from './TopArea';
import { LeftArea } from './LeftArea';
import { FloatArea } from './FloatArea';
import { FixedArea } from './FixedArea';
import { Toolbar } from './Toolbar';
import { RightArea } from './RightArea';
import { MainArea } from './MainArea';
import { BottomArea } from './BottomArea';
import { observer } from '../../obx';
import { ToolbarTop } from './ToolbarTop';
import { useNamespace } from '@etfma/hooks';

export const Workbench = observer(
  defineComponent({
    name: 'Workbench',
    props: {
      skeleton: {
        type: Object as PropType<Skeleton>,
        required: true,
      },
    },
    setup() {
      const ns = useNamespace('workbench');

      return {
        ns,
      };
    },
    render() {
      const { ns, skeleton } = this;
      return (
        <div class={classNames(ns.b())}>
          <TopArea area={skeleton.topArea} />
          <div class={classNames(ns.b('body'))}>
            <LeftArea area={skeleton.leftArea} />
            <FloatArea area={skeleton.floatArea} />
            <FixedArea area={skeleton.fixedArea} />
            <div class={classNames(ns.b('center'))}>
              <Toolbar area={skeleton.toolbar} />
              <ToolbarTop area={skeleton.toolbarTop} />
              <MainArea area={skeleton.mainArea} />
              <BottomArea area={skeleton.bottomArea} />
            </div>
            <RightArea area={skeleton.rightArea} />
          </div>
        </div>
      );
    },
  }),
);
