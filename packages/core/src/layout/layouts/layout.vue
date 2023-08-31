s<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { computed, watchEffect } from 'vue';
  import LayoutContent from './layout-content.vue';
  import LayoutFooter from './layout-footer.vue';
  import LayoutHeader from './layout-header.vue';
  import LayoutAside from './layout-aside.vue';
  import LayoutToolbar from './layout-toolbar.vue';
  import { useNamespace } from '@etfma/hooks';
  import type { IPublicLayout, ISkeleton } from '@etfma/types';

  defineOptions({
    name: 'Layout',
    inheritAttrs: false,
  });

  interface Props extends IPublicLayout {
    /**
     * 框架实例
     * @default
     */
    skeleton: ISkeleton;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const emit = defineEmits(['update:mixed-extra-visible', 'update:side-collapse']);

  const { b, e } = useNamespace('layout');

  const sideCollapseState = computed({
    get() {
      return props.sideCollapse;
    },
    set(collapse) {
      emit('update:side-collapse', collapse);
    },
  });

  /**
   * 动态获取侧边区域是否可见
   */
  const getSideVisible = computed(() => {
    const { layout, sideVisible } = props;
    return layout !== 'header-nav' && sideVisible;
  });

  /**
   * 侧边区域离顶部高度
   */
  const sidePaddingTop = computed(() => {
    const { layout, headerHeight, isMobile } = props;
    return layout === 'mixed-nav' && !isMobile ? headerHeight : 0;
  });

  /**
   * 动态获取侧边宽度
   */
  const getSiderWidth = computed(() => {
    const { layout, sideWidth, isMobile, sideCollapseWidth, sideMixedWidth } = props;
    let width = 0;
    if (sideCollapseState.value) {
      width = isMobile ? 0 : sideCollapseWidth!;
    } else {
      if (layout === 'side-mixed-nav' && !isMobile) {
        width = sideMixedWidth!;
      } else {
        width = sideWidth!;
      }
    }
    return width;
  });

  /**
   * header 宽度
   */
  const getHeaderWidth = computed(() => {
    const { layout } = props;
    if (layout === 'header-nav' || layout === 'mixed-nav') {
      return `calc(100%)`;
    } else {
      return `calc(100% - ${getSiderWidth.value}px)`;
    }
  });

  /**
   * footer tab 宽度
   */
  const getFooterAndTabWidth = computed(() => {
    const { layout } = props;
    if (layout === 'header-nav' || layout === 'full-content') {
      return `calc(100%)`;
    } else {
      return `calc(100% - ${getSiderWidth.value}px)`;
    }
  });

  /**
   * 是否侧边栏模式，包含混合侧边
   */
  const isSideMode = computed(() => ['side-nav', 'side-mixed-nav'].includes(props.layout!));

  /**
   * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const fullContent = computed(() => props.layout === 'full-content');

  /**
   * 是否侧边混合模式
   */
  const isSideMixed = computed(() => props.layout === 'side-mixed-nav');

  /**
   * 遮罩可见性
   */
  const maskVisible = computed(() => !sideCollapseState.value && props.isMobile);

  /**
   * header fixed值
   */
  const getHeaderFixed = computed(() => (props.layout === 'mixed-nav' ? true : props.headerFixed));

  /**
   * tab top 值
   */
  const tabTop = computed(() => (fullContent.value ? 0 : props.headerHeight));

  /**
   * 计算contentPaddingTop的高度
   */
  const getContentPaddingTop = computed(() => {
    return props.breadcrumbVisible ? 0 : props.contentPaddingTop;
  });

  /**
   * 侧边栏z-index
   */
  const sideZIndex = computed(() => {
    const { zIndex, isMobile } = props;
    const offset = isMobile || isSideMode.value ? 1 : -1;
    return zIndex! + offset;
  });

  const maskStyle = computed((): CSSProperties => {
    return {
      zIndex: props.zIndex,
    };
  });

  watchEffect(() => {
    sideCollapseState.value = props.isMobile;
  });

  function handleExtraVisible(visible: boolean) {
    emit('update:mixed-extra-visible', visible);
  }

  function handleClickMask() {
    sideCollapseState.value = true;
  }
</script>

<template>
  <div :class="b()">
    <slot></slot>
    <LayoutAside
      v-if="getSideVisible"
      :skeleton="skeleton"
      :show="!fullContent"
      :width="getSiderWidth"
      :side-extra-width="sideWidth"
      :mixed-extra-visible="mixedExtraVisible"
      :z-index="sideZIndex"
      :dom-visible="!isMobile"
      :is-side-mixed="isSideMixed"
      :padding-top="sidePaddingTop"
      :fixed-mixed-extra="fixedMixedExtra"
      :background-color="sideBackgroundColor"
      @extra-visible="handleExtraVisible"
    >
    </LayoutAside>

    <div :class="e('main')">
      <div :class="e('shadow')">
        <LayoutHeader
          v-if="headerVisible"
          :skeleton="skeleton"
          :show="!fullContent"
          :z-index="zIndex"
          :height="headerHeight"
          :width="getHeaderWidth"
          :fixed="getHeaderFixed"
          :full-width="!isSideMode"
          :background-color="headerBackgroundColor"
        >
        </LayoutHeader>
        <LayoutToolbar
          v-if="tabVisible"
          :skeleton="skeleton"
          :width="getFooterAndTabWidth"
          :background-color="tabBackgroundColor"
          :top="tabTop"
          :z-index="zIndex"
          :height="tabHeight"
          :fixed="getHeaderFixed"
        >
        </LayoutToolbar>
      </div>

      <LayoutContent
        :skeleton="skeleton"
        :padding="contentPadding"
        :padding-top="getContentPaddingTop"
        :padding-right="contentPaddingRight"
        :padding-bottom="contentPaddingBottom"
        :padding-left="contentPaddingLeft"
      >
      </LayoutContent>

      <LayoutFooter
        v-if="footerVisible"
        :skeleton="skeleton"
        :width="getFooterAndTabWidth"
        :show="!fullContent"
        :zIndex="zIndex"
        :height="footerHeight"
        :fixed="footerFixed"
        :background-color="footerBackgroundColor"
      >
      </LayoutFooter>
    </div>
    <div v-if="maskVisible" :class="e('mask')" :style="maskStyle" @click="handleClickMask"></div>
  </div>
</template>

<style scoped module lang="scss">
  @include b('layout') {
    display: flex;
    height: 100%;

    @include e('main') {
      display: flex;
      flex: auto;
      flex-direction: column;
      position: relative;
    }

    @include e('shadow') {
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    }

    @include e('mask') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 40%);
      transition: background-color 0.2s;
    }
  }
</style>
