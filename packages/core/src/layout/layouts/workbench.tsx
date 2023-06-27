import { defineComponent, PropType } from 'vue';
import { Skeleton } from '../skeleton';
import '../../styles/index.scss';
import classNames from 'classnames';
import { HeaderArea } from './HeaderArea';
import { AsideArea } from './AsideArea';
import { FloatArea } from './FloatArea';
import { FixedArea } from './FixedArea';
import { ToolbarArea } from './ToolbarArea';
import { MainArea } from './MainArea';
import { FooterArea } from './FooterArea';
import { observer } from '../../obx';
import { BreadcrumbArea } from './BreadcrumbArea';
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
          <HeaderArea area={skeleton.header} />
          <div class={classNames(ns.b('body'))}>
            <AsideArea area={skeleton.aside} />
            <FloatArea area={skeleton.float} />
            <FixedArea area={skeleton.fixed} />
            <div class={classNames(ns.b('center'))}>
              <ToolbarArea area={skeleton.toolbar} />
              <BreadcrumbArea area={skeleton.breadcrumb} />
              <MainArea area={skeleton.main} />
              <FooterArea area={skeleton.footer} />
            </div>
          </div>
        </div>
      );
    },
  }),
);
