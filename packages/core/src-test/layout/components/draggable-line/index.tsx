import classNames from 'classnames';
import { defineComponent, PropType, onMounted, onUnmounted, ref, unref } from 'vue';
import './index.less';

export interface DraggableLineProps {
  onDrag: (l: number, e: any) => any;
  onDragStart?: () => any;
  onDragEnd?: () => any;
  position?: 'right' | 'left' | 'top';
  className?: string;
  maxIncrement?: number;
  maxDecrement?: number;
}

export const DraggableLine = defineComponent({
  name: 'DraggableLine',
  props: {
    position: {
      type: String as PropType<'right' | 'left' | 'top'>,
      default: 'right',
    },
    maxIncrement: {
      type: Number,
      default: 100,
    },
    maxDecrement: {
      type: Number,
      default: 0,
    },
    onDrag: {
      type: Function as PropType<(l: number, e: any) => any>,
    },
    onDragStart: {
      type: Function as PropType<() => any>,
    },
    onDragEnd: {
      type: Function as PropType<() => any>,
    },
  },
  setup(props) {
    let startDrag = false;
    let offset = 0;
    let currentOffset = 0;
    let offEvent: () => void;
    let offDragEvent: any;
    let startOffset: any;

    const shell = ref<HTMLElement>();

    onMounted(() => {
      offEvent = initEvent();
    });
    onUnmounted(() => {
      if (offEvent) {
        offEvent();
      }
    });

    const initEvent = () => {
      const selectStart = onSelectStart;
      document.addEventListener('selectstart', selectStart);
      return () => document.removeEventListener('selectstart', selectStart);
    };

    const onSelectStart = (e: any) => {
      if (startDrag) {
        e.preventDefault();
      }
    };

    const onStartMove = (e: any) => {
      const { onDragStart } = props;
      if (!startDrag) {
        onDragStart && onDragStart();
      }
      startDrag = true;
      currentOffset = 0;
      offDragEvent = initDragEvent();
      startOffset = getClientPosition(e);
    };

    const onEndMove = () => {
      const { onDragEnd } = props;
      if (startDrag) {
        if (offDragEvent) {
          offDragEvent();
        }
        startDrag = false;
        offset = currentOffset;
      }
      onDragEnd && onDragEnd();
    };

    const onDrag = (e: any) => {
      const { position, onDrag, maxIncrement = 100, maxDecrement = 0 } = props;
      if (startDrag) {
        if (position === 'left' || position === 'top') {
          currentOffset = offset + startOffset - getClientPosition(e);
        } else {
          currentOffset = offset + getClientPosition(e) - startOffset;
        }

        if (currentOffset < -maxDecrement) {
          currentOffset = -maxDecrement;
        } else if (currentOffset > maxIncrement) {
          currentOffset = maxIncrement;
        }

        onDrag && onDrag(currentOffset, e);
      }
    };

    const getClientPosition = (e: any) => {
      const { position } = props;
      return position === 'left' || position === 'right' ? e.clientX : e.clientY;
    };

    const initDragEvent = () => {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onEndMove);
      return () => {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onEndMove);
      };
    };

    const getParent = () => {
      return unref(shell)?.parentElement;
    };

    return {
      shell,
      onStartMove,
      getParent,
    };
  },

  render() {
    return (
      <div
        ref={(ref) => {
          this.shell = ref as any;
        }}
        class={classNames(
          this.position === 'left' || this.position === 'right'
            ? 'lc-draggable-line-vertical'
            : 'lc-draggable-line-horizontal',
        )}
        onMousedown={(e) => this.onStartMove(e)}
      />
    );
  },
});
