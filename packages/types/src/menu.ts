import type { RouteMeta } from './router';

/**
 * 菜单原始对象
 */
interface MenuRecordRaw {
  /**
   * 菜单名
   */
  name: string;
  /**
   * 菜单路径，唯一，可当作key
   */
  path: string;
  /**
   * 是否显示菜单
   * @default true
   */
  show?: boolean;
  /**
   * 是否禁用菜单
   * @default false
   */
  disabled?: boolean;
  /**
   * 排序号
   */
  orderNo?: number;
  /**
   * 图标名
   */
  icon?: string;
  /**
   * 子菜单
   */
  children?: MenuRecordRaw[];
  /**
   * 原信息
   */
  meta?: RouteMeta;
}

export type { MenuRecordRaw };
