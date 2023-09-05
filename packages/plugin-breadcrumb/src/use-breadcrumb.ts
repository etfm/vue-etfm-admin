import { REDIRECT_NAME } from 'etfm-engine';
import { filter, findPath } from '@etfm/shared';
import { MenuRecordRaw } from '@etfm/types';
import { Ref, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

export function useBreadcrumb(menusRef: Ref<MenuRecordRaw[]>) {
  const { currentRoute } = useRouter();

  const breadcrumbList = ref<MenuRecordRaw[]>([]);

  /**
   * @description 获取所有父级路径
   * @param treeData
   * @param path
   * @returns
   */
  function getAllParentPath(treeData: MenuRecordRaw[], path: string) {
    const menuList = findPath(treeData, (n) => n.path === path);
    return (menuList || []).map((item) => item.path);
  }

  function getMatched(menus: MenuRecordRaw[], parent: string[]) {
    const metched: MenuRecordRaw[] = [];
    menus.forEach((item) => {
      if (parent.includes(item.path)) {
        metched.push({
          ...item,
          title: item.meta?.title || item.name,
        });
      }
      if (item.children?.length) {
        metched.push(...getMatched(item.children as any, parent));
      }
    });
    return metched;
  }

  function filterItem(list: MenuRecordRaw[]) {
    return filter(list, (item) => {
      const { meta, name } = item;
      if (!meta) {
        return !!name;
      }
      const { title, hideBreadcrumb, hideMenu } = meta;
      if (!title || hideBreadcrumb || hideMenu) {
        return false;
      }
      return true;
    }).filter((item) => !item.meta?.hideBreadcrumb);
  }

  watchEffect(() => {
    if (currentRoute.value.name === REDIRECT_NAME) return;
    const menus = menusRef.value;

    const routeMatched = currentRoute.value.matched;
    const cur = routeMatched?.[routeMatched.length - 1];
    let path = currentRoute.value.path;

    if (cur && cur?.meta?.currentActiveMenu) {
      path = cur.meta.currentActiveMenu as string;
    }

    const parent = getAllParentPath(menus, path);
    const filterMenus = menus.filter((item) => item.path === parent[0]);
    const matched = getMatched(filterMenus, parent) as any;

    if (!matched || matched.length === 0) return;

    const list = filterItem(matched);

    if (currentRoute.value.meta?.currentActiveMenu) {
      list.push({
        ...currentRoute.value,
        name: currentRoute.value.name as string,
        title: currentRoute.value.meta?.title,
      });
    }
    breadcrumbList.value = list;
  });

  return {
    breadcrumbList,
  };
}
