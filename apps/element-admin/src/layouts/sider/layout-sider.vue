<template>
  <!-- 默认的左侧菜单等 -->
  <div>
    <ElAside>
      <ElScrollbar>
        <BasicMenu />
      </ElScrollbar>
    </ElAside>
  </div>
</template>
<script setup lang="ts">
import { ElAside, ElScrollbar } from 'element-plus'
import { BasicMenu } from '../components/menu'
</script>
