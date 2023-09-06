<script lang="tsx">
  import { defineComponent, PropType, ref } from 'vue';
  import { Widget } from '../../widget';

  export default defineComponent({
    name: 'WidgetView',
    props: {
      widget: {
        type: Object as PropType<Widget>,
        required: true,
      },
    },
    setup(props) {
      const visible = ref(props.widget.visible);

      props.widget.onVisible((name, widget) => {
        if (props.widget.name === name) {
          visible.value = widget.visible;
        }
      });

      props.widget.onHide((name, widget) => {
        if (props.widget.name === name) {
          visible.value = widget.visible;
        }
      });

      return {
        visible,
      };
    },
    render() {
      if (!this.visible) {
        return null;
      }
      return <>{this.widget.body}</>;
    },
  });
</script>
