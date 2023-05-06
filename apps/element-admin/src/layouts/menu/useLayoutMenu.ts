import { Menu } from '@/router/types';
import { usePermissionStore } from '@/store/permission';
import { ref, watch } from 'vue';

export function useLayoutMenu() {
  const permissionStore = usePermissionStore();

  const menuRef = ref<Menu[]>([]);

  watch(
    () => permissionStore.getMenuList,
    () => {
      menuRef.value = getMenu();
    },
    {
      immediate: true,
    },
  );

  function getMenu() {
    const menuFilter = (items) => {
      return items.filter((item) => {
        const show = !item.meta?.hideMenu && !item.hideMenu;
        if (show && item.children) {
          item.children = menuFilter(item.children);
        }
        return show;
      });
    };
    return menuFilter(permissionStore.getMenuList);
  }

  return {
    menuRef,
  };
}
