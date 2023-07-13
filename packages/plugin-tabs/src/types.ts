export type TabSizeMap = Map<Key, { width: number; height: number; left: number; top: number }>;

export interface TabOffset {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
}

export type TabOffsetMap = Map<Key, TabOffset>;

export type Key = string | number;
