<script setup lang="ts">
  import { useNamespace } from '@etfm/hooks';
  import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
  import { Icon } from '@etfm/icon';
  import { PublicMultipleTab } from '../hooks/use-multiple-tab';
  import { RouteLocationNormalized } from 'vue-router';
  import { useTabDropdown } from '../hooks/use-tab-dropdown';

  defineOptions({
    name: 'tab-operate',
  });

  const props = withDefaults(
    defineProps<{
      store: PublicMultipleTab;
      trigger?: 'hover' | 'click' | 'contextmenu';
      tabItem?: RouteLocationNormalized;
    }>(),
    {
      trigger: 'hover',
    },
  );

  const store = props.store;

  const ns = useNamespace('op');
  const { getDropMenuList, handleContextMenu, handleMenuEvent } = useTabDropdown(props, store);

  function handleContext() {
    props.tabItem && handleContextMenu(props.tabItem);
  }
</script>
<template>
  <div :class="ns.b()">
    <ElDropdown :trigger="trigger" @command="handleMenuEvent" @visible-change="handleContext">
      <slot />
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            :command="item.key"
            :disabled="item.disabled"
            :divided="item.divider"
            v-for="item in getDropMenuList"
          >
            <Icon :class="ns.b('item-icon')" :size="18" :icon="item.icon" />
            <span>{{ item.title }}</span>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<style module lang="scss">
  @include b(op) {
    cursor: pointer;
    outline: none;
  }

  @include b(op-item-icon) {
    margin-right: 4px;
  }
</style>
