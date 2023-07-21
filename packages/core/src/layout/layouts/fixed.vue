<script lang="tsx">
  import classNames from 'classnames';
  import { defineComponent, PropType } from 'vue';
  import { Area } from '../area';
  import { observer } from '../../obx';
  import { useNamespace } from '@etfma/hooks';

  export default observer(
    defineComponent({
      name: 'FixedArea',
      props: {
        area: {
          type: Object as PropType<Area>,
          required: true,
        },
      },
      setup() {
        const ns = useNamespace('fixed-area');

        return {
          ns,
        };
      },
      render() {
        const { area, ns } = this;
        const width = area?.config?.props?.width;
        const style = width
          ? {
              width,
            }
          : undefined;

        return (
          <div
            class={classNames(ns.b(), {
              [ns.is('visible')]: area.visible,
            })}
            style={style}
          >
            {area.items.map((item) => item.content)}
          </div>
        );
      },
    }),
  );
</script>
<style lang="scss" scoped module>
  @include b('fixed-area') {
    position: relative;
    z-index: 820;
    display: none;
    flex-shrink: 0;
    height: 100%;

    @include when('visible') {
      display: block;
    }
  }
</style>
