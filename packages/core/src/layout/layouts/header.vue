<script lang="tsx">
  import classNames from 'classnames';
  import { defineComponent, PropType } from 'vue';
  import { Area } from '../area';
  import { observer } from '../../obx';
  import { useNamespace } from '@etfma/hooks';

  export default observer(
    defineComponent({
      name: 'HeaderArea',
      props: {
        area: {
          type: Object as PropType<Area>,
          required: true,
        },
      },
      setup() {
        const ns = useNamespace('header-area');

        return { ns };
      },
      render() {
        const { ns, area } = this;
        const left: any[] = [];
        const center: any[] = [];
        const right: any[] = [];
        area.items
          .slice()
          .sort((a, b) => {
            const index1 = a.config?.index || 0;
            const index2 = b.config?.index || 0;
            return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
          })
          .forEach((item) => {
            const content = item.content;
            if (item.align === 'center') {
              center.push(content);
            } else if (item.align === 'left') {
              left.push(content);
            } else {
              right.push(content);
            }
          });

        return (
          <div
            class={classNames(ns.b(), {
              [ns.is('visible')]: this.area.visible,
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

<style lang="scss" module>
  :root {
    @include set-component-css-var('header-area', $header-area);
  }

  @include b('header-area') {
    display: none;
    width: 100%;
    background-color: getCssVar('header-area', 'bg-color');
    box-shadow: 0 0 1px 0 #888;
    min-height: 60px;
    margin-bottom: 1px;

    @include when('visible') {
      display: flex;
    }

    @include b('header-area-left') {
      display: flex;
      align-items: center;
    }

    @include b('header-area-center') {
      display: flex;
      flex: 1;
      align-items: center;
    }

    @include b('header-area-right') {
      display: flex;
      align-items: center;
    }
  }
</style>
