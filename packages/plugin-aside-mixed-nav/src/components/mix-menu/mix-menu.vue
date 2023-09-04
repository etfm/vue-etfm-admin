<script setup lang="ts">
  import { useNamespace } from '@etfma/hooks';
  import { Icon } from '@etfma/icon';
  import { computed } from 'vue';
  import { config } from '@etfma/core';
  import { MenuRecordRaw } from '@etfma/types';

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

  const emit = defineEmits<{
    click: [mens: MenuRecordRaw[]];
    'update:default-active': [e: string];
  }>();
  const menuModules = computed(() => props.menus);

  function handleActive(item: MenuRecordRaw) {
    emit('update:default-active', item.path);

    config.set('layout.mixedExtraVisible', true);

    emit('click', item.children ?? []);
  }

  function getIocn(item: MenuRecordRaw) {
    return (item.icon || (item.meta && item.meta.icon)) as string;
  }
</script>

<template>
  <div
    :class="[
      b(),
      {
        mini: collapse,
      },
    ]"
  >
    <ul :class="b('module')">
      <li
        :class="[
          be('module', 'item'),
          {
            [bem('module', 'item', 'active')]: item.path == defaultActive,
          },
        ]"
        v-for="item in menuModules"
        :key="item.path"
        @click="handleActive(item)"
      >
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
    &.mini &-module {
      &__item {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &__name {
        display: none;
      }

      &__icon {
        margin-bottom: 0;
      }
    }
  }

  @include b(mix-sider-module) {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
    color: getCssVar('menu-text-color');

    &__item {
      position: relative;
      padding: 16px 0;
      transition: all 0.2s ease;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: getCssVar('menu-hover-text-color');
        background-color: getCssVar('menu-bg-sub-menu-item-hover-color') !important;

        // &::before {
        //   background-color: getCssVar('menu-bg-sub-menu-item-hover-color') !important;
        //   border-radius: 3px;
        //   clear: both;
        //   content: '';
        //   inset: 0 8px;
        //   margin: 2px 0;
        //   position: absolute;
        // }
      }

      &--active {
        color: getCssVar('menu-active-color');
        background-color: getCssVar('menu-bg-sub-menu-item-active-color') !important;

        &::before {
          // background-color: getCssVar('menu-bg-sub-menu-item-active-color') !important;
          // border-radius: 3px;
          // clear: both;
          // content: '';
          // inset: 0 8px;
          // margin: 2px 0;
          // position: absolute;

          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background-color: getCssVar('menu-active-color');
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
