<script lang="tsx">
  import classNames from 'classnames';
  import { defineComponent, PropType } from 'vue';
  import { Area } from '../area';
  import { observer } from '../../obx';
  import { useNamespace } from '@etfma/hooks';

  export default observer(
    defineComponent({
      name: 'MainArea',
      props: {
        area: {
          type: Object as PropType<Area>,
          required: true,
        },
      },
      setup() {
        const ns = useNamespace('main-area');
        return { ns };
      },
      render() {
        const { ns, area } = this;
        return <div class={classNames(ns.b())}>{area.items.map((item) => item.content)}</div>;
      },
    }),
  );
</script>
<style lang="scss" module>
  @include b('main-area') {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
</style>
