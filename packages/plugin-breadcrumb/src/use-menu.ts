import { material } from '@etfma/core';
import { isHttpUrl, lodash, treeMap } from '@etfma/shared';
import { MenuRecordRaw, AppRouteModule } from '@etfma/types';
import { ref } from 'vue';

export function useMenu() {
  const menusRef = ref<MenuRecordRaw[]>([]);

  /**
   * @description 处理路径
   * @param menus
   * @param parentPath
   */
  function joinParentPath(menus: MenuRecordRaw[], parentPath = '') {
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index];
      // https://next.router.vuejs.org/guide/essentials/nested-routes.html
      // Note that nested paths that start with / will be treated as a root path.
      // 请注意，以 / 开头的嵌套路径将被视为根路径。
      // This allows you to leverage the component nesting without having to use a nested URL.
      // 这允许你利用组件嵌套，而无需使用嵌套 URL。
      if (!(menu.path.startsWith('/') || isHttpUrl(menu.path))) {
        // path doesn't start with /, nor is it a url, join parent path
        // 路径不以 / 开头，也不是 url，加入父路径
        menu.path = `${parentPath}/${menu.path}`;
      }
      if (menu?.children?.length) {
        joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
      }
    }
  }

  /**
   * @description 路由解析
   * @param routeModList
   * @param routerMapping
   * @returns
   */
  function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
    // 借助 lodash 深拷贝
    const cloneRouteModList = lodash.cloneDeep(routeModList);
    const routeList: AppRouteModule[] = [];

    // 对路由项进行修改
    cloneRouteModList.forEach((item) => {
      if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
        item.path = item.redirect;
      }

      if (item.meta?.single) {
        const realItem = item?.children?.[0];
        realItem && routeList.push(realItem);
      } else {
        routeList.push(item);
      }
    });
    // 提取树指定结构
    const list = treeMap(routeList, {
      conversion: (node: AppRouteModule) => {
        const { meta: { title, hideMenu = false } = {} } = node;

        return {
          ...(node.meta || {}),
          meta: node.meta,
          title,
          hideMenu,
          name: node.name,
          path: node.path,
          ...(node.redirect ? { redirect: node.redirect } : {}),
        };
      },
    });
    // 路径处理
    joinParentPath(list);
    return lodash.cloneDeep(list);
  }

  /**
   * @description 获取所有转换成功的路径
   * @param menus
   * @returns
   */
  function getMenu(menus: AppRouteModule[]): MenuRecordRaw[] {
    const menuFilter = (items) => {
      return items.filter((item) => {
        const show = !item.meta?.hideMenu && !item.hideMenu;
        item.meta.title = item.meta.title;
        item.title = item.meta.title;

        if (show && item.children) {
          item.children = menuFilter(item.children);
        }
        return show;
      });
    };
    return menuFilter(menus);
  }

  /**
   * @description 页面加载监听路由资源变化
   */
  material.onChangeAssets('routes', (routes: AppRouteModule[]) => {
    const transfromMenus = transformRouteToMenu(routes);
    const menus = getMenu(transfromMenus);
    menusRef.value = menus;
  });

  return {
    menusRef,
  };
}
