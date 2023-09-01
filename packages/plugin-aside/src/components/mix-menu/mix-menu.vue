<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { Icon } from '@etfma/icon';
  import { computed, ref, watchEffect } from 'vue';
  import { config, event } from '@etfma/core';
  import { MenuRecordRaw } from '@etfma/types';
  import { findPath } from '@etfma/shared';

  interface Props {
    menus: MenuRecordRaw[];
    collapse?: boolean;
    defaultActive?: string;
  }

  const { b, be, bem } = useNamespace('mix-sider', { isCssModule: false });

  const props = withDefaults(defineProps<Props>(), {
    menus: () => [],
    collapse: false,
  });

  const menuModules = computed(() => props.menus);

  const activePath = ref();

  watchEffect(() => {
    const paths = findPath(props.menus, (item) => {
      return item.path == props.defaultActive;
    });

    const path = paths && paths.length > 0 ? paths[0].path : '';

    activePath.value = path;
  });

  function handleActive(item: MenuRecordRaw) {
    activePath.value = item.path;

    config.set('layout.mixedExtraVisible', true);
    event.emit('extra:routes', item.children ?? []);
  }

  function getIocn(item: MenuRecordRaw) {
    return (item.icon || (item.meta && item.meta.icon)) as string;
  }
</script>

<template>
  <div :class="b()">
    <ul :class="b('module')">
      <li
        :class="[
          be('module', 'item'),
          {
            [bem('module', 'item', 'active')]: item.path == activePath,
          },
        ]"
        v-for="item in menuModules"
        :key="item.path"
        @click="handleActive(item)"
      >
        <!-- <SimpleMenuTag :item="item" collapseParent dot /> -->
        <Icon :class="be('module', 'icon')" :size="collapse ? 16 : 20" :icon="getIocn(item)" />
        <p :class="be('module', 'name')">
          {{ item.title }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  @include b(mix-sider) {
  }

  @include b(mix-sider-module) {
    position: relative;
    padding: 0;
    list-style: none;
    color: getCssVar('menu-text-color');

    &__item {
      position: relative;
      padding: 12px 0;
      transition: all 0.2s ease;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: getCssVar('menu-hover-text-color');

        &::before {
          background-color: getCssVar('menu-bg-sub-menu-item-hover-color') !important;
          border-radius: 3px;
          clear: both;
          content: '';
          inset: 0 8px;
          margin: 2px 0;
          position: absolute;
        }
      }

      &--active {
        color: getCssVar('menu-active-color');

        &::before {
          background-color: getCssVar('menu-bg-sub-menu-item-active-color') !important;
          border-radius: 3px;
          clear: both;
          content: '';
          inset: 0 8px;
          margin: 2px 0;
          position: absolute;
        }
      }
    }

    &__icon {
      margin-bottom: 8px;
      transition: all 0.2s;
      font-size: 24px;
      position: relative;
    }

    &__name {
      margin: 0;
      transition: all 0.2s;
      position: relative;
      font-size: 12px;
    }
  }
</style>
