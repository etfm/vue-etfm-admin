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

        /**
         * 是否侧边栏模式，包含混合侧边
         */
        const isSideMode = computed(() => ['side-nav', 'side-mixed-nav'].includes(props.layout));

        /**
         * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
         */
        const fullContent = computed(() => props.layout === 'full-content');

        /**
         * 是否侧边混合模式
         */
        const isSideMixed = computed(() => props.layout === 'side-mixed-nav');

        /**
         * 遮罩可见性
         */
        const maskVisible = computed(() => !sideCollapseState.value && props.isMobile);

        /**
         * header fixed值
         */
        const getHeaderFixed = computed(() =>
          props.layout === 'mixed-nav' ? true : props.headerFixed,
        );

        /**
         * tab top 值
         */
        const tabTop = computed(() => (fullContent.value ? 0 : props.headerHeight));

        /**
         * 侧边栏z-index
         */
        const sideZIndex = computed(() => {
          const { zIndex, isMobile } = props;
          const offset = isMobile || isSideMode.value ? 1 : -1;
          return zIndex + offset;
        });

        const maskStyle = computed((): CSSProperties => {
          return {
            zIndex: props.zIndex,
          };
        });

        watchEffect(() => {
          sideCollapseState.value = props.isMobile;
        });

        function handleExtraVisible(visible: boolean) {
          emit('update:mixed-extra-visible', visible);
        }

        function handleClickMask() {
          sideCollapseState.value = true;
        }

        return {
          ns,
          workbenchClass,
          bodyClass,
          layout,
        };
      },
      render() {
        const { ns, skeleton, workbenchClass, layout, bodyClass } = this;
        return <div id="workbench" class={workbenchClass}></div>;
      },
    }),
  );
</script>

<style lang="scss" module>
  @include b('layout') {
    display: flex;

    @include e('main') {
      display: flex;
      flex: auto;
      flex-direction: column;
    }

    @include e('mask') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 40%);
      transition: background-color 0.2s;
    }
  }
</style>
