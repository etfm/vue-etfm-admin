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
<style lang="scss" scoped module>
  @include b('main-area') {
    flex: 1;
  }
</style>
