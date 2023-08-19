<script setup lang="ts">
  import { Skeleton } from '../skeleton';
  import Layout from './layout.vue';
  import { engineConfig } from '../../config';
  import { ref } from 'vue';
  import { deepMerge } from '@etfma/shared';

  interface Props {
    skeleton: Skeleton;
  }

  withDefaults(defineProps<Props>(), {});

  const model = ref<{
    /**
     * 布局方式
     * side-nav 侧边菜单布局
     * header-nav 顶部菜单布局
     * mixed-nav 侧边&顶部菜单布局
     * side-mixed-nav 侧边混合菜单布局
     * full-content 全屏内容布局
     * @default side-nav
     */
    layout?: 'side-nav' | 'header-nav' | 'mixed-nav' | 'side-mixed-nav' | 'full-content';
    /**
     * 是否移动端显示
     * @default false
     */
    isMobile?: boolean;
    /**
     * zIndex
     * @default 100
     */
    zIndex?: number;
    /**
     * header是否显示
     * @default true
     */
    headerVisible?: boolean;
    /**
     * header高度
     * @default 48
     */
    headerHeight?: number;
    /**
     * header是否固定在顶部
     * @default true
     */
    headerFixed?: boolean;
    /**
     * 背景颜色
     * @default #fff
     */
    headerBackgroundColor?: string;
    /**
     * 侧边栏是否可见
     * @default true
     */
    sideVisible?: boolean;
    /**
     * 侧边栏宽度
     * @default 180
     */
    sideWidth?: number;
    /**
     * 混合侧边栏宽度
     * @default 80
     */
    sideMixedWidth?: number;
    /**
     * 侧边栏背景颜色
     * @default #fff
     */
    sideBackgroundColor?: string;
    /**
     * 侧边菜单折叠状态
     * @default false
     */
    sideCollapse?: boolean;
    /**
     *  侧边菜单折叠宽度
     * @default 48
     */
    sideCollapseWidth?: number;
    /**
     * padding
     * @default 16
     */
    contentPadding?: number;
    /**
     * paddingBottom
     * @default 16
     */
    contentPaddingBottom?: number;
    /**
     * paddingTop
     * @default 16
     */
    contentPaddingTop?: number;
    /**
     * paddingLeft
     * @default 16
     */
    contentPaddingLeft?: number;
    /**
     * paddingRight
     * @default 16
     */
    contentPaddingRight?: number;
    /**
     * footer 是否可见
     * @default false
     */
    footerVisible?: boolean;
    /**
     * footer 高度
     * @default 32
     */
    footerHeight?: number;
    /**
     * footer 是否固定
     * @default true
     */
    footerFixed?: boolean;
    /**
     * footer背景颜色
     * @default #fff
     */
    footerBackgroundColor?: string;
    /**
     * tab是否可见
     * @default true
     */
    tabVisible?: boolean;
    /**
     * tab高度
     * @default 30
     */
    tabHeight?: number;
    /**
     * footer背景颜色
     * @default #fff
     */
    tabBackgroundColor?: string;
    /**
     * 混合侧边扩展区域是否可见
     * @default false
     */
    mixedExtraVisible?: boolean;
    /**
     * 固定混合侧边菜单
     * @default false
     */
    fixedMixedExtra?: boolean;
  }>({
    layout: 'side-nav',
    zIndex: 1000,
    isMobile: false,
    headerVisible: true,
    headerHeight: 48,
    headerFixed: true,
    headerBackgroundColor: '#fff',
    sideVisible: true,
    sideWidth: 180,
    sideMixedWidth: 80,
    sideCollapse: false,
    sideCollapseWidth: 48,
    sideBackgroundColor: '#fff',
    contentPadding: 16,
    contentPaddingBottom: 16,
    contentPaddingTop: 16,
    contentPaddingLeft: 16,
    contentPaddingRight: 16,
    footerBackgroundColor: '#fff',
    footerHeight: 32,
    footerFixed: true,
    footerVisible: false,
    tabVisible: true,
    tabHeight: 30,
    tabBackgroundColor: '#fff',
    mixedExtraVisible: false,
    fixedMixedExtra: false,
  });

  engineConfig.onGot('layout', (layout) => {
    // model.value = deepMerge(model.value, layout);
  });
</script>

<template>
  <Layout v-bind="model" :skeleton="skeleton"> </Layout>
</template>
