<script lang="tsx">
  import classNames from 'classnames';
  import { defineComponent, PropType } from 'vue';
  import { Area } from '../area';
  import { observer } from '../../obx';
  import { useNamespace } from '@etfma/hooks';

  export default observer(
    defineComponent({
      name: 'ToolbarArea',
      props: {
        area: {
          type: Object as PropType<Area>,
          required: true,
        },
      },
      setup() {
        const ns = useNamespace('toolbar-area');

        return { ns };
      },
      render() {
        const { ns, area } = this;
        if (area.isEmpty()) {
          return null;
        }

        const left: any[] = [];
        const center: any[] = [];
        const right: any[] = [];
        area.items.forEach((item) => {
          const content = item.content;
          if (item.align === 'center') {
            center.push(content);
          } else if (item.align === 'right') {
            right.push(content);
          } else {
            left.push(content);
          }
        });

        return (
          <div
            class={classNames(ns.b(), {
              [ns.is('visible')]: area.visible,
            })}
          >
            <div class={classNames(ns.b('left'))}>{left}</div>
            <div class={classNames(ns.b('center'))}>{center}</div>
            <div class={classNames(ns.b('right'))}>{right}</div>
          </div>
        );
      },
    }),
  );
</script>
<style lang="scss" module scoped>
  @include b('toolbar-area') {
    display: none;
    width: 100%;
    background-color: getCssVar('toolbar-area', 'bg-color');

    @include set-component-css-var('toolbar-area', $toolbar-area);

    @include when('visible') {
      display: flex;
    }

    @include b('toolbar-area-center') {
      display: flex;
      flex: 1;
      align-items: center;
    }
  }
</style>
