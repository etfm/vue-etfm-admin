import { computed } from 'vue';
import type { ComponentInternalInstance, Ref } from 'vue';

export default function useMenu(instance: ComponentInternalInstance, currentIndex: Ref<string>) {
  const indexPath = computed(() => {
    let parent = instance.parent!;
    const path = [currentIndex.value];
    while (parent.type.name !== 'EtfmMenu') {
      if (parent.props.index) {
        path.unshift(parent.props.index as string);
      }
      parent = parent.parent!;
    }
    return path;
  });

  const parentMenu = computed(() => {
    let parent = instance.parent;
    while (parent && !['EtfmMenu', 'EtfmSubMenu'].includes(parent.type.name!)) {
      parent = parent.parent;
    }
    return parent!;
  });

  return {
    parentMenu,
    indexPath,
  };
}
