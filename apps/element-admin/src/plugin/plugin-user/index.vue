<script setup lang="ts">
  import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
  import { useNamespace } from '@etfm/hooks';

  defineOptions({
    name: 'PluginUser',
    inheritAttrs: false,
  });

  const ns = useNamespace('plugin-user');
</script>
<template>
  <ElDropdown>
    <div :class="ns.b()">lzdjack</div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem> 退出登录 </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
<style lang="scss" module>
  @include b(plugin-user) {
    padding: 0 16px;
    padding-left: 0;
    cursor: pointer;
    outline: none;
  }
</style>
