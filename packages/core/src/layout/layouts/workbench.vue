<script lang="tsx">
  import { defineComponent, PropType, ref, computed } from 'vue';
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
      setup(props) {
        const ns = useNamespace('workbench');

        const { config } = props.skeleton.editor;

        const layout = ref('aside');

        config.onGot('layout', (args: string) => {
          layout.value = args;
        });

        const workbenchClass = computed(() => {
          return [ns.b(), layout.value === 'aside' ? ns.m('row') : ns.m('column')];
        });

        const bodyClass = computed(() => {
          return [ns.b('body'), layout.value === 'aside' ? ns.m('column') : ns.m('row')];
        });

        return {
          ns,
          workbenchClass,
          bodyClass,
          layout,
        };
      },
      render() {
        const { ns, skeleton, workbenchClass, layout, bodyClass } = this;
        return (
          <div id="workbench" class={workbenchClass}>
            {layout === 'aside' && <AsideArea area={skeleton.aside} />}
            {/* {layout !== 'aside' && <HeaderArea area={skeleton.header} />} */}
            {layout === 'aside' && <FloatArea area={skeleton.float} />}
            {layout === 'aside' && <FixedArea area={skeleton.fixed} />}

            <div id="workbench-body" class={bodyClass}>
              {layout === 'aside' && <HeaderArea area={skeleton.header} />}
              {layout !== 'aside' && <AsideArea area={skeleton.aside} />}
              {layout !== 'aside' && <FloatArea area={skeleton.float} />}
              {layout !== 'aside' && <FixedArea area={skeleton.fixed} />}

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

<style lang="scss" module>
  @include b('workbench') {
    display: flex;
    height: 100%;
    background-color: getCssVar('bg-color');

    @include m('column') {
      flex-direction: column;
    }

    @include m('row') {
      flex-direction: row;
    }

    @include b('workbench-body') {
      position: relative;
      display: flex;
      flex: 1;
      overflow: hidden;
      margin-left: 1px;
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
