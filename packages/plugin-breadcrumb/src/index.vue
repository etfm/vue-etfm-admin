<script setup lang="ts">
  import { EtfmaBreadcrumb, EtfmaBreadcrumbItem } from '@etfma/etfma-ui';

  import { useMenu } from './use-menu';
  import { useBreadcrumb } from './use-breadcrumb';
  import { useNamespace } from '@etfma/hooks';
  import { Icon } from '@etfma/icon';
  import { MenuRecordRaw } from '@etfma/types';
  import { lodash } from '@etfma/shared';
  import { useGo } from '@etfma/core';
  import { EtfmaDropdownItem, EtfmaDropdownMenu, EtfmaDropdown } from '@etfma/etfma-ui';

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
    <EtfmaBreadcrumb :separator="separator">
      <EtfmaBreadcrumbItem v-for="item in breadcrumbList" :key="item.path">
        <EtfmaDropdown v-if="hasRedirect(breadcrumbList, item)" @command="handleMenuEvent">
          <div :class="ns.b('dropdown')">
            <Icon :icon="getIcon(item)" v-if="getIcon(item)" />
            <router-link to="" @click="handleClick(item, $event)">
              {{ getTitle(item) }}
            </router-link></div
          >
          <template #dropdown>
            <EtfmaDropdownMenu>
              <EtfmaDropdownItem :command="cItem.path" v-for="cItem in item.children">
                <Icon v-if="getIcon(cItem)" :icon="getIcon(cItem)" />
                <span>{{ getTitle(cItem) }}</span>
              </EtfmaDropdownItem>
            </EtfmaDropdownMenu>
          </template>
        </EtfmaDropdown>
        <span v-else>
          {{ getTitle(item) }}
        </span>
      </EtfmaBreadcrumbItem>
    </EtfmaBreadcrumb>
  </div>
</template>
<style lang="scss" scoped>
  @include b(plugin-breadcrumb) {
    padding: 16px 20px;
  }

  @include b(plugin-breadcrumb-dropdown) {
    outline: none;
  }
</style>
