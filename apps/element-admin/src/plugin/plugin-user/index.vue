<script setup lang="ts">
  import { EtfmaDropdown, EtfmaDropdownItem, EtfmaDropdownMenu } from '@etfma/ui';
  import { useNamespace } from '@etfma/hooks';

  defineOptions({
    name: 'PluginUser',
    inheritAttrs: false,
  });

  const ns = useNamespace('plugin-user');
</script>
<template>
  <EtfmaDropdown>
    <div :class="ns.b()">lzdjack</div>
    <template #dropdown>
      <EtfmaDropdownMenu>
        <EtfmaDropdownItem> 退出登录 </EtfmaDropdownItem>
      </EtfmaDropdownMenu>
    </template>
  </EtfmaDropdown>
</template>
<style lang="scss" module>
  @include b(plugin-user) {
    padding: 0 16px;
    cursor: pointer;
    outline: none;
  }
</style>
