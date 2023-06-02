import type { Router } from '@etfma/router';
import { useAppStore } from '@/store/app';
// import { useMultipleTabStore } from '@/store/multipleTab'
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
import { PageEnum } from '../enum';
import { removeTabChangeListener } from '@etfma/element-ui';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      // const tabStore = useMultipleTabStore()
      const userStore = useUserStore();
      const appStore = useAppStore();
      const permissionStore = usePermissionStore();
      appStore.resetAllState();
      permissionStore.resetState();
      // tabStore.resetState();
      userStore.resetState();
      removeTabChangeListener();
    }
  });
}
