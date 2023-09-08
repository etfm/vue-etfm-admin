<script setup lang="ts">
  import { CSSProperties, watch } from 'vue';
  import { computed, watchEffect, Teleport } from 'vue';
  import LayoutContent from './layout-content.vue';
  import LayoutFooter from './layout-footer.vue';
  import LayoutHeader from './layout-header.vue';
  import LayoutAside from './layout-aside.vue';
  import LayoutToolbar from './layout-toolbar.vue';
  import { useNamespace } from '@etfm/hooks';
  import type { IPublicLayout, ISkeleton } from '@etfm/types';
  import { engineConfig } from '../../config';

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

      engineConfig.set('layout.sideCollapse', collapse);
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
    const { layout, fixedMixedExtra, sideWidth, sideVisible, isMobile } = props;
    if (
      layout === 'header-nav' ||
      layout === 'mixed-nav' ||
      !sideVisible ||
      fullContent.value ||
      isMobile
    ) {
      return 'calc(100%)';
    } else if (layout === 'side-nav') {
      return `calc(100% - ${getSiderWidth.value}px)`;
    } else {
      return `calc(100% - ${
        fixedMixedExtra ? sideWidth! + getSiderWidth.value : getSiderWidth.value
      }px)`;
    }
  });

  /**
   * footer tab 宽度
   */
  const getFooterAndTabWidth = computed(() => {
    const { layout, sideVisible, fixedMixedExtra, sideWidth, isMobile } = props;
    if (layout === 'header-nav' || fullContent.value || !sideVisible || isMobile) {
      return 'calc(100%)';
    } else if (layout === 'side-nav' || layout === 'mixed-nav') {
      return `calc(100% - ${getSiderWidth.value}px)`;
    } else {
      return `calc(100% - ${
        fixedMixedExtra ? sideWidth! + getSiderWidth.value : getSiderWidth.value
      }px)`;
    }
  });

  /**
   * 是否侧边栏模式，包含混合侧边
   */
  const isSideMode = computed(() => ['side-nav', 'side-mixed-nav'].includes(props.layout!));

  /**
   * 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const fullContent = computed(() => props.isFullContent);

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

  /**
   * header z-index
   */
  // const headerZIndex = computed(() => {
  //   const { zIndex } = props;
  //   return zIndex! + 1;
  // });

  // /**
  //  * 侧边栏z-index
  //  */
  // const sideZIndex = computed(() => {
  //   const { isMobile } = props;
  //   return isMobile ? headerZIndex.value + 1 : headerZIndex.value;
  // });

  // const maskStyle = computed((): CSSProperties => {
  //   return {
  //     zIndex: headerZIndex.value,
  //   };
  // });

  watchEffect(() => {
    sideCollapseState.value = props.isMobile;
  });

  watchEffect(() => {
    if (props.isMobile && props.layout !== 'side-nav') {
      engineConfig.set('layout', 'side-nav');
    }
  });

  watch(
    () => props.layout,
    () => {
      if (props.isMobile) {
        engineConfig.set('layout', 'side-nav');
      }
    },
    {
      immediate: true,
    },
  );

  function handleExtraVisible(visible: boolean) {
    emit('update:mixed-extra-visible', visible);

    engineConfig.set('layout.mixedExtraVisible', visible);
  }

  function handleClickMask() {
    sideCollapseState.value = true;
  }
</script>

<template>
  <div :class="b()">
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

      <LayoutContent
        :skeleton="skeleton"
        :padding="contentPadding"
        :padding-top="contentPaddingTop"
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
    <Teleport to="body">
      <div v-if="maskVisible" :class="e('mask')" :style="maskStyle" @click="handleClickMask"></div>
    </Teleport>
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
