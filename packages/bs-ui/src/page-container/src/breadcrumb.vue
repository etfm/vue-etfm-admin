<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { MenuRecordRaw } from '@etfma/types';
  import { EtfmaBreadcrumb, EtfmaBreadcrumbItem } from '@etfma/ui';
  import { watchEffect, unref, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Icon } from '@etfma/icon';
  import { lodash } from '@etfma/shared';
  import { useGo } from '@etfma/core';

  const { b, e } = useNamespace('header-breadcrumb');

  const { currentRoute } = useRouter();
  const go = useGo();

  interface Props {
    separator?: string;
    showIcon?: boolean;
    breadcrumbList?: MenuRecordRaw[];
  }

  const props = withDefaults(defineProps<Props>(), {
    separator: '/',
    showIcon: true,
    breadcrumbList: () => [],
  });

  const basicBreadcrumbList = ref<MenuRecordRaw[]>([]);

  watchEffect(() => {
    const matched = unref(currentRoute).matched as MenuRecordRaw[];
    basicBreadcrumbList.value = matched.filter((item) => {
      const show = !item.meta?.hideMenu && !item.hideMenu;
      item.title = item?.meta?.title;

      return show;
    });
  });

  const getBreadcrumbList = computed(
    () => (!!props.breadcrumbList.length && props.breadcrumbList) || basicBreadcrumbList.value,
  );

  function hasRedirect(menu: MenuRecordRaw) {
    return !!menu.children?.length;
  }

  function getIcon(menu) {
    return props.showIcon && (menu.icon || menu.meta?.icon);
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
</script>

<template>
  <header>
    <div :class="b()">
      <EtfmaBreadcrumb :separator="separator">
        <EtfmaBreadcrumbItem v-for="item in getBreadcrumbList" :key="item.path">
          <router-link v-if="hasRedirect(item)" to="" @click="handleClick(item, $event)">
            <div :class="e('link')">
              <Icon :icon="getIcon(item)" v-if="getIcon(item)" />
              {{ getTitle(item) }}
            </div>
          </router-link>

          <span v-else>
            {{ getTitle(item) }}
          </span>
        </EtfmaBreadcrumbItem>
      </EtfmaBreadcrumb>
    </div>
  </header>
</template>
<style lang="scss" module>
  @include b(header-breadcrumb) {
    @include e(link) {
      display: flex;
      justify-items: center;
      align-items: center;
    }
  }
</style>