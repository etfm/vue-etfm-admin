<script lang="tsx">
  import classNames from 'classnames';
  import { defineComponent, PropType } from 'vue';
  import { Area } from '../area';
  import { observer } from '../../obx';
  import { useNamespace } from '@etfma/hooks';

  export default observer(
    defineComponent({
      name: 'AsideArea',
      props: {
        area: {
          type: Object as PropType<Area>,
          required: true,
        },
      },
      setup() {
        const ns = useNamespace('aside-area');

        return {
          ns,
        };
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
            id="aside-area"
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
<style lang="scss" scoped module>
  @include b('aside-area') {
    display: none;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;
    overflow: hidden;

    @include when('visible') {
      display: flex;
    }

    @include b('aside-area-top') {
      display: flex;
      align-items: center;
      width: 100%;
    }

    @include b('aside-area-center') {
      display: flex;
      flex: 1;
      align-items: center;
      width: 100%;
    }

    @include b('aside-area-bottom') {
      display: flex;
      align-items: center;
      width: 100%;
    }
  }
</style>
