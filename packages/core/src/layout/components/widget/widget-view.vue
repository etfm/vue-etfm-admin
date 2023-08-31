<script lang="tsx">
  import { defineComponent, PropType, ref } from 'vue';
  import DraggableLineView from './draggable-line-view.vue';
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

      props.widget.onVisible((_, widget) => {
        visible.value = widget.visible;
      });

      return {
        visible,
      };
    },
    render() {
      if (!this.visible) {
        return null;
      }
      return (
        <>
          {this.widget.body}
          {this.widget.config.props?.enableDrag && <DraggableLineView widget={this.widget} />}
        </>
      );
    },
  });
</script>
