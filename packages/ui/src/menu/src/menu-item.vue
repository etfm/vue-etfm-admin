<template>
  <li
    :class="[nsMenuItem.b(), nsMenuItem.is('active', active), nsMenuItem.is('disabled', disabled)]"
    role="menuitem"
    tabindex="-1"
    @click="handleClick"
  >
    <etfma-tooltip
      v-if="parentMenu.type.name === 'EtfmMenu' && rootMenu?.props.collapse && $slots.title"
      :effect="rootMenu.props.popperEffect"
      placement="right"
      :fallback-placements="['left']"
      persistent
    >
      <template #content>
        <slot name="title" />
      </template>
      <div :class="nsMenu.be('tooltip', 'trigger')">
        <slot />
      </div>
    </etfma-tooltip>
    <template v-else>
      <slot />
      <slot name="title" />
    </template>
  </li>
</template>

<script lang="ts" setup>
  import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeUnmount,
    onMounted,
    reactive,
    toRef,
  } from 'vue';
  import EtfmaTooltip from '../../tooltip';
  import { loggerError } from '@etfma/shared';
  import { useNamespace } from '@etfma/hooks';
  import useMenu from './use-menu';
  import { menuItemEmits, menuItemProps } from './menu-item';

  import type { MenuProvider, SubMenuProvider } from './types';

  const COMPONENT_NAME = 'EtfmMenuItem';

  defineOptions({
    name: 'EtfmMenuItem',
  });

  const props = defineProps(menuItemProps);
  const emit = defineEmits(menuItemEmits);
  const instance = getCurrentInstance()!;
  const rootMenu = inject<MenuProvider>('rootMenu');
  const nsMenu = useNamespace('menu', { isCssModule: false });
  const nsMenuItem = useNamespace('menu-item', { isCssModule: false });
  if (!rootMenu) loggerError(COMPONENT_NAME, 'can not inject root menu');

  const { parentMenu, indexPath } = useMenu(instance, toRef(props as any, 'index'));

  const subMenu = inject<SubMenuProvider>(`subMenu:${parentMenu.value.uid}`);
  if (!subMenu) loggerError(COMPONENT_NAME, 'can not inject sub menu');

  const active = computed(() => props.index === rootMenu?.activeIndex);
  const item = reactive({
    index: props.index as string,
    indexPath,
    active,
  });

  const handleClick = () => {
    if (!props.disabled) {
      rootMenu?.handleMenuItemClick({
        index: props.index as string,
        indexPath: indexPath.value,
        route: props.route,
      });
      emit('click', item);
    }
  };

  onMounted(() => {
    subMenu?.addSubMenu(item);
    rootMenu?.addMenuItem(item);
  });

  onBeforeUnmount(() => {
    subMenu?.removeSubMenu(item);
    rootMenu?.removeMenuItem(item);
  });
</script>
