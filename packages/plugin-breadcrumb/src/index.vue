<script setup lang="ts">
  import { useMenu } from './use-menu';
  import { useBreadcrumb } from './use-breadcrumb';
  import { useNamespace } from '@etfm/hooks';
  import { Icon } from '@etfm/icon';
  import { MenuRecordRaw } from '@etfm/types';
  import { lodash } from '@etfm/shared';
  import { useGo } from 'etfm-engine';
  import {
    ElDropdownItem,
    ElDropdownMenu,
    ElDropdown,
    ElBreadcrumb,
    ElBreadcrumbItem,
  } from 'element-plus';

  defineOptions({
    name: 'plugin-breadcrumb',
    inheritAttrs: false,
  });

  interface Props {
    /**
     * 分隔符
     * @default /
     */
    separator?: string;
  }

  withDefaults(defineProps<Props>(), {
    separator: '/',
  });

  const ns = useNamespace('plugin-breadcrumb');

  const go = useGo();

  const { menusRef } = useMenu();

  const { breadcrumbList } = useBreadcrumb(menusRef);

  function hasRedirect(menus: MenuRecordRaw[], menu: MenuRecordRaw) {
    return menus.indexOf(menu) !== menus.length - 1;
  }

  function getIcon(menu) {
    return menu.icon || menu.meta?.icon;
  }

  function getTitle(menu) {
    return menu.title || menu.meta?.title || menu.name;
  }

  function handleClick(route: MenuRecordRaw, e: Event) {
    e?.preventDefault();
    const { children, redirect, path } = route;

    if (children?.length && !redirect) {
      e?.stopPropagation();
      return;
    }

    if (redirect && lodash.isString(redirect)) {
      go(redirect);
    } else {
      go(path);
    }
  }

  function handleMenuEvent(path: string) {
    go(path);
  }
</script>
<template>
  <div :class="ns.b()">
    <ElBreadcrumb :separator="separator">
      <ElBreadcrumbItem v-for="item in breadcrumbList" :key="item.path">
        <ElDropdown v-if="hasRedirect(breadcrumbList, item)" @command="handleMenuEvent">
          <div :class="ns.b('dropdown')">
            <Icon :icon="getIcon(item)" v-if="getIcon(item)" />
            <router-link to="" @click="handleClick(item, $event)">
              {{ getTitle(item) }}
            </router-link></div
          >
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem :command="cItem.path" v-for="cItem in item.children">
                <Icon v-if="getIcon(cItem)" :icon="getIcon(cItem)" />
                <span>{{ getTitle(cItem) }}</span>
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <span v-else>
          {{ getTitle(item) }}
        </span>
      </ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
</template>
<style lang="scss" module>
  @include b(plugin-breadcrumb) {
    padding: 16px 20px;
  }

  @include b(plugin-breadcrumb-dropdown) {
    outline: none;
  }
</style>
