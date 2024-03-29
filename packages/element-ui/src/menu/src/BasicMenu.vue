<script setup lang="ts">
  import BasicSubMenu from './BasicSubMenu.vue';
  import type { MenuRecordRaw } from '@etfm/types';
  import { MenuModeEnum, Mode } from './enum';
  import { CSSProperties, computed, reactive, watch } from 'vue';
  import { lodash } from '@etfm/shared';
  import { ElMenu } from 'element-plus';
  import { useNamespace } from '@etfm/hooks';

  defineOptions({
    name: 'BasicMenu',
  });

  interface Props {
    /**
     * 页面加载时默认激活菜单的 index
     * @default ''
     */
    defaultActive?: string;
    /**
     * 默认打开的 sub-menu 的 index 的数组
     * @default []
     */
    defaultOpened?: Array<string>;
    /**
     * 菜单列表
     * @default MenuRecordRaw[]
     */
    menus: MenuRecordRaw[];
    /**
     * 菜单组件mode属性
     * @default MenuModeEnum.VERTICAL
     */
    mode?: Mode;
    /**
     * 是否只保持一个子菜单的展开
     * @default false
     */
    uniqueOpened?: boolean;
    /**
     * 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
     * @default false
     */
    collapse?: boolean;
    /**
     * 是否省略多余的子项（仅在横向模式生效）
     * @default true
     */
    ellipsis?: boolean;
    /**
     * 当菜单为横向时，触发方式
     * @default hover
     */
    menuTrigger?: 'hover' | 'click';
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: MenuModeEnum.VERTICAL,
    uniqueOpened: false,
    collapse: false,
    ellipsis: true,
    menuTrigger: 'hover',
  });

  const emit = defineEmits<{ (event: 'menuClick', arg: string): void }>();

  const ns = useNamespace('basic-menu');

  const menuState = reactive<{
    defaultActive: string;
    defaultOpeneds: string[];
  }>({
    defaultActive: '',
    defaultOpeneds: [],
  });

  const style = computed<CSSProperties>(() => {
    return {
      backgroundColor: 'inherit',
    };
  });

  watch(
    () => props.defaultActive,
    (newVal) => {
      menuState.defaultActive = newVal ?? '';
    },
    {
      immediate: true,
    },
  );

  /**
   * 收集默认打开菜单的key
   * @param keys
   */
  function setOpenKeys(keys: string[]) {
    menuState.defaultOpeneds = lodash.uniq([...menuState.defaultOpeneds, ...keys]);
  }

  /**
   * 删除默认打开菜单的集合key
   * @param key
   */
  function removeKey(key: string) {
    lodash.remove(menuState.defaultOpeneds, (k) => key == k);
  }

  /**
   * 收集当前打开的菜单
   * @param _
   * @param indexPath
   */
  function handleOpen(_: string, indexPath: string[]) {
    setOpenKeys(indexPath);
  }
  /**
   * 收起的 sub-menu触发，删除缓存中默认打开的key
   * @param index
   */
  function handleClose(index: string) {
    removeKey(index);
  }

  /**
   * 菜单被选中
   * @param index
   */
  function handleSelect(index) {
    emit('menuClick', index);
  }
</script>

<template>
  <ElMenu
    :class="ns.b()"
    :style="style"
    :mode="props.mode"
    :default-active="menuState.defaultActive"
    :default-openeds="menuState.defaultOpeneds"
    :unique-opened="props.uniqueOpened"
    :collapse="collapse"
    :collapse-transition="false"
    :menu-trigger="menuTrigger"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <template v-for="item in menus" :key="item.path">
      <BasicSubMenu :menu="item" />
    </template>
  </ElMenu>
</template>
<style lang="scss" module>
  @include b(basic-menu) {
    height: 100%;
  }
</style>
