<template>
  <ElContainer>
    <!-- 顶部头 包含头部菜单，实现头部上下布局。 不能与LayoutMultipleHeader里的 header同时存在 -->
    <LayoutHeader />
    <ElContainer>
      <!-- 左侧菜单 左右菜单布局、上下菜单布局 -->
      <!-- <LayoutSider /> -->
      <ElContainer>
        <!-- tabs  不能与LayoutHeader和LayoutMultipleHeader里的header同时存在 -->
        <!-- <LayoutMultipleHeader /> -->
        <!-- 内容区域 -->
        <!-- <LayoutContent /> -->
        <!-- 底部区域 -->
        <!-- <LayoutFooter /> -->
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<script lang="ts" setup>
import { ElContainer } from 'element-plus'
import LayoutHeader from './header/layout-header.vue'
import LayoutSider from './sider/setting-sider.vue'
import LayoutMultipleHeader from './header/layout-multiple-header.vue'
import LayoutContent from './content/layout-content.vue'
import LayoutFooter from './footer/layout-footer.vue'
</script>
