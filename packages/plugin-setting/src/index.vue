<script setup lang="ts">
  import { Icon } from '@etfm/icon';
  import { useNamespace } from '@etfm/hooks';
  import { useDrawer } from '@etfm/element-ui';

  import DrawerSetting from './drawer-setting.vue';

  defineOptions({
    name: 'plugin-setting',
    inheritAttrs: false,
  });

  const ns = useNamespace('p-setting');

  const [register, { openDrawer }] = useDrawer();

  function handleClick() {
    openDrawer(true);
  }
</script>
<template>
  <div :class="ns.b()" @click="handleClick">
    <Icon icon="material-symbols:settings-rounded" />
  </div>

  <DrawerSetting @register="register" />
</template>

<style lang="scss" module>
  @include b(p-setting) {
    padding: 0 16px;
    outline: none;
    cursor: pointer;
  }
</style>
