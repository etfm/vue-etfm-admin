<script lang="tsx">
  import { defineComponent, PropType } from 'vue';
  import { observer } from '../../obx';
  import { Skeleton } from '../skeleton';
  import { useNamespace } from '@etfma/hooks';

  import HeaderArea from './header.vue';
  import AsideArea from './aside.vue';
  import FloatArea from './float.vue';
  import FixedArea from './fixed.vue';
  import ToolbarArea from './toolbar.vue';
  import MainArea from './main.vue';
  import FooterArea from './footer.vue';
  import BreadcrumbArea from './breadcrumb.vue';

  export default observer(
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
          <div id="workbench" class={ns.b()}>
            <HeaderArea area={skeleton.header} />
            <div id="workbench-body" class={ns.b('body')}>
              <AsideArea area={skeleton.aside} />
              <FloatArea area={skeleton.float} />
              <FixedArea area={skeleton.fixed} />
              <div class={ns.b('center')}>
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
</script>

<style lang="scss" scoped module>
  @include b('workbench') {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: getCssVar('bg-color', 'page');

    @include b('workbench-body') {
      position: relative;
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    @include b('workbench-center') {
      z-index: 10;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
    }
  }
</style>
