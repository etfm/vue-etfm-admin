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

      console.log(menuRef.value, '============================>>>useLayoutMenu');
    },
    {
      immediate: true,
    },
  );

  function getMenu() {
    return permissionStore.getMenuList.filter((item) => !item.hideMenu && !item.meta?.hideMenu);
  }

  return {
    menuRef,
  };
}
