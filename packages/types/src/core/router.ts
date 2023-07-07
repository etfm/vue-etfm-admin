import { Router } from 'vue-router';
import { AppRouteRecordRaw } from '../router';

export interface IGlobalRouter {
  router: Router;
  init(): void;
  getRouters(routes: AppRouteRecordRaw[] | AppRouteRecordRaw): AppRouteRecordRaw[];
}
