import { Menu } from '@/router/types';
import { usePermissionStore } from '@/store/permission';
import { ref, watch } from 'vue';
import { useI18n } from '@etfma/locale';

export function useLayoutMenu() {
  const permissionStore = usePermissionStore();
  const { t } = useI18n();

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
        item.meta.title = t(item.meta.title);
        item.title = t(item.meta.title);
        item.name = t(item.meta.title);

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
