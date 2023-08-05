<script lang="tsx">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    h,
    nextTick,
    onMounted,
    provide,
    reactive,
    ref,
    watch,
    watchEffect,
  } from 'vue';
  import { useResizeObserver } from '@vueuse/core';
  import { EtfmaIcon } from '../../icon';
  import { More } from './svg';
  import { flattedChildren, lodash } from '@etfma/shared';
  import { useNamespace } from '@etfma/hooks';
  import Menubar from './utils/menu-bar';
  import ElMenuCollapseTransition from './menu-collapse-transition.vue';
  import ElSubMenu from './sub-menu';
  import { useMenuCssVar } from './use-menu-css-var';

  import { MenuProvider, SubMenuProvider } from './types';
  import type { Router } from 'vue-router';
  import type { VNode, VNodeArrayChildren } from 'vue';
  import type { UseResizeObserverReturn } from '@vueuse/core';
  import { menuEmits, menuProps } from './props';

  export default defineComponent({
    name: 'EtfmMenu',
    props: menuProps,
    emits: menuEmits,
    setup(props, { emit, slots, expose }) {
      const instance = getCurrentInstance()!;
      const router = instance.appContext.config.globalProperties.$router as Router;
      const menu = ref<HTMLUListElement>();
      const nsMenu = useNamespace('menu', { isCssModule: false });
      const nsSubMenu = useNamespace('sub-menu', { isCssModule: false });

      // data
      const sliceIndex = ref(-1);

      const openedMenus = ref<MenuProvider['openedMenus']>(
        props.defaultOpeneds && !props.collapse ? props.defaultOpeneds.slice(0) : [],
      );
      const activeIndex = ref<MenuProvider['activeIndex']>(props.defaultActive);
      const items = ref<MenuProvider['items']>({});
      const subMenus = ref<MenuProvider['subMenus']>({});

      // computed
      const isMenuPopup = computed<MenuProvider['isMenuPopup']>(() => {
        return props.mode === 'horizontal' || (props.mode === 'vertical' && props.collapse);
      });

      // methods
      const initMenu = () => {
        const activeItem = activeIndex.value && items.value[activeIndex.value];
        if (!activeItem || props.mode === 'horizontal' || props.collapse) return;

        const indexPath = activeItem.indexPath;

        // 展开该菜单项的路径上所有子菜单
        // expand all subMenus of the menu item
        indexPath.forEach((index) => {
          const subMenu = subMenus.value[index];
          subMenu && openMenu(index, subMenu.indexPath);
        });
      };

      const openMenu: MenuProvider['openMenu'] = (index, indexPath) => {
        if (openedMenus.value.includes(index)) return;
        // 将不在该菜单路径下的其余菜单收起
        // collapse all menu that are not under current menu item
        if (props.uniqueOpened) {
          openedMenus.value = openedMenus.value.filter((index: string) =>
            indexPath.includes(index),
          );
        }
        openedMenus.value.push(index);
        emit('open', index, indexPath);
      };

      const close = (index: string) => {
        const i = openedMenus.value.indexOf(index);
        if (i !== -1) {
          openedMenus.value.splice(i, 1);
        }
      };

      const closeMenu: MenuProvider['closeMenu'] = (index, indexPath) => {
        close(index);
        emit('close', index, indexPath);
      };

      const handleSubMenuClick: MenuProvider['handleSubMenuClick'] = ({ index, indexPath }) => {
        const isOpened = openedMenus.value.includes(index);

        if (isOpened) {
          closeMenu(index, indexPath);
        } else {
          openMenu(index, indexPath);
        }
      };

      const handleMenuItemClick: MenuProvider['handleMenuItemClick'] = (menuItem) => {
        if (props.mode === 'horizontal' || props.collapse) {
          openedMenus.value = [];
        }

        const { index, indexPath } = menuItem;
        if (lodash.isNil(index) || lodash.isNil(indexPath)) return;

        if (props.router && router) {
          const route = menuItem.route || index;
          const routerResult = router.push(route).then((res) => {
            if (!res) activeIndex.value = index;
            return res;
          });
          emit('select', index, indexPath, { index, indexPath, route }, routerResult);
        } else {
          activeIndex.value = index;
          emit('select', index, indexPath, { index, indexPath });
        }
      };

      const updateActiveIndex = (val: string) => {
        const itemsInData = items.value;
        const item =
          itemsInData[val] ||
          (activeIndex.value && itemsInData[activeIndex.value]) ||
          itemsInData[props.defaultActive];

        if (item) {
          activeIndex.value = item.index;
        } else {
          activeIndex.value = val;
        }
      };

      const calcSliceIndex = () => {
        if (!menu.value) return -1;
        const items = Array.from(menu.value?.childNodes ?? []).filter(
          (item) =>
            // remove comment type node #12634
            item.nodeName !== '#comment' && (item.nodeName !== '#text' || item.nodeValue),
        ) as HTMLElement[];
        const moreItemWidth = 64;
        const paddingLeft = Number.parseInt(getComputedStyle(menu.value!).paddingLeft, 10);
        const paddingRight = Number.parseInt(getComputedStyle(menu.value!).paddingRight, 10);
        const menuWidth = menu.value!.clientWidth - paddingLeft - paddingRight;
        let calcWidth = 0;
        let sliceIndex = 0;
        items.forEach((item, index) => {
          calcWidth += item.offsetWidth || 0;
          if (calcWidth <= menuWidth - moreItemWidth) {
            sliceIndex = index + 1;
          }
        });
        return sliceIndex === items.length ? -1 : sliceIndex;
      };

      // Common computer monitor FPS is 60Hz, which means 60 redraws per second. Calculation formula: 1000ms/60 ≈ 16.67ms, In order to avoid a certain chance of repeated triggering when `resize`, set wait to 16.67 * 2 = 33.34
      const debounce = (fn: () => void, wait = 33.34) => {
        let timmer: ReturnType<typeof setTimeout> | null;
        return () => {
          timmer && clearTimeout(timmer);
          timmer = setTimeout(() => {
            fn();
          }, wait);
        };
      };

      let isFirstTimeRender = true;
      const handleResize = () => {
        const callback = () => {
          sliceIndex.value = -1;
          nextTick(() => {
            sliceIndex.value = calcSliceIndex();
          });
        };
        // execute callback directly when first time resize to avoid shaking
        isFirstTimeRender ? callback() : debounce(callback)();
        isFirstTimeRender = false;
      };

      watch(
        () => props.defaultActive,
        (currentActive) => {
          if (!items.value[currentActive]) {
            activeIndex.value = '';
          }
          updateActiveIndex(currentActive);
        },
      );

      watch(
        () => props.collapse,
        (value) => {
          if (value) openedMenus.value = [];
        },
      );

      watch(items.value, initMenu);

      let resizeStopper: UseResizeObserverReturn['stop'];
      watchEffect(() => {
        if (props.mode === 'horizontal' && props.ellipsis)
          resizeStopper = useResizeObserver(menu, handleResize).stop;
        else resizeStopper?.();
      });

      // provide
      {
        const addSubMenu: MenuProvider['addSubMenu'] = (item) => {
          subMenus.value[item.index] = item;
        };

        const removeSubMenu: MenuProvider['removeSubMenu'] = (item) => {
          delete subMenus.value[item.index];
        };

        const addMenuItem: MenuProvider['addMenuItem'] = (item) => {
          items.value[item.index] = item;
        };

        const removeMenuItem: MenuProvider['removeMenuItem'] = (item) => {
          delete items.value[item.index];
        };
        provide<MenuProvider>(
          'rootMenu',
          reactive({
            props,
            openedMenus,
            items,
            subMenus,
            activeIndex,
            isMenuPopup,

            addMenuItem,
            removeMenuItem,
            addSubMenu,
            removeSubMenu,
            openMenu,
            closeMenu,
            handleMenuItemClick,
            handleSubMenuClick,
          }),
        );
        provide<SubMenuProvider>(`subMenu:${instance.uid}`, {
          addSubMenu,
          removeSubMenu,
          mouseInChild: ref(false),
          level: 0,
        });
      }

      // lifecycle
      onMounted(() => {
        if (props.mode === 'horizontal') {
          new Menubar(instance.vnode.el!, nsMenu.namespace);
        }
      });

      {
        const open = (index: string) => {
          const { indexPath } = subMenus.value[index];
          indexPath.forEach((i) => openMenu(i, indexPath));
        };

        expose({
          open,
          close,
          handleResize,
        });
      }

      return () => {
        let slot: VNodeArrayChildren = slots.default?.() ?? [];
        const vShowMore: VNode[] = [];

        if (props.mode === 'horizontal' && menu.value) {
          const originalSlot = flattedChildren(slot) as VNodeArrayChildren;
          const slotDefault =
            sliceIndex.value === -1 ? originalSlot : originalSlot.slice(0, sliceIndex.value);

          const slotMore = sliceIndex.value === -1 ? [] : originalSlot.slice(sliceIndex.value);

          if (slotMore?.length && props.ellipsis) {
            slot = slotDefault;
            vShowMore.push(
              h(
                ElSubMenu,
                {
                  index: 'sub-menu-more',
                  class: nsSubMenu.e('hide-arrow'),
                },
                {
                  title: () =>
                    h(
                      EtfmaIcon,
                      {
                        class: nsSubMenu.e('icon-more'),
                      },
                      { default: () => h(More) },
                    ),
                  default: () => slotMore,
                },
              ),
            );
          }
        }

        const ulStyle = useMenuCssVar(props, 0);

        const vMenu = h(
          'ul',
          {
            key: String(props.collapse),
            role: 'menubar',
            ref: menu,
            style: ulStyle.value,
            class: {
              [nsMenu.b()]: true,
              [nsMenu.m(props.mode)]: true,
              [nsMenu.m('collapse')]: props.collapse,
            },
          },
          [...slot, ...vShowMore],
        );

        if (props.collapseTransition && props.mode === 'vertical') {
          return h(ElMenuCollapseTransition, () => vMenu);
        }

        return vMenu;
      };
    },
  });
</script>
<style lang="scss">
  @mixin menu-item {
    display: flex;
    align-items: center;
    height: getCssVar('menu-item-height');
    line-height: getCssVar('menu-item-height');
    font-size: getCssVar('menu-item-font-size');
    color: getCssVar('menu-text-color');
    padding: 0 getCssVar('menu-base-level-padding');
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color getCssVar('transition-duration'),
      background-color getCssVar('transition-duration'), color getCssVar('transition-duration');
    box-sizing: border-box;
    white-space: nowrap;
    background-color: #000;

    * {
      vertical-align: bottom;
    }

    i {
      color: inherit;
    }

    &:hover,
    &:focus {
      outline: none;
    }

    &:hover {
      background-color: getCssVar('menu-hover-bg-color');
    }

    @include when(disabled) {
      opacity: 0.25;
      cursor: not-allowed;
      background: none !important;
    }
  }

  :root {
    // They are defined on :root so they can be inherited by sub-menu instead of overwritten
    @include set-component-css-var('menu', $menu);
  }

  @include b(menu) {
    border-right: none;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: getCssVar('menu-bg-color');
    box-sizing: border-box;
    padding: 8px;

    @include m(vertical) {
      &:not(.#{$namespace}-menu--collapse):not(.#{$namespace}-menu--popup-container) {
        & .#{$namespace}-menu-item,
        & .#{$namespace}-sub-menu__title,
        & .#{$namespace}-menu-item-group__title {
          white-space: nowrap;
          padding-left: calc(
            #{getCssVar('menu-base-level-padding')} + #{getCssVar('menu-level')} * #{getCssVar(
                'menu-level-padding'
              )}
          );
        }
      }
    }

    @include m(horizontal) {
      display: flex;
      flex-wrap: nowrap;
      border-bottom: none;
      border-right: none;

      & > .#{$namespace}-menu-item {
        display: inline-flex;
        justify-content: center;
        align-items: center;

        height: 100%;
        margin: 0;
        border-bottom: 2px solid transparent;
        color: getCssVar('menu-text-color');

        a,
        a:hover {
          color: inherit;
        }

        &:not(.is-disabled):hover,
        &:not(.is-disabled):focus {
          background-color: #fff;
        }
      }
      & > .#{$namespace}-sub-menu {
        &:focus,
        &:hover {
          outline: none;
        }

        &:hover {
          .#{$namespace}-sub-menu__title {
            color: getCssVar('menu-hover-text-color');
          }
        }

        &.is-active {
          .#{$namespace}-sub-menu__title {
            border-bottom: 2px solid getCssVar('menu-active-color');
            color: getCssVar('menu-active-color');
          }
        }

        & .#{$namespace}-sub-menu__title {
          height: 100%;
          border-bottom: 2px solid transparent;
          color: getCssVar('menu-text-color');

          &:hover {
            background-color: getCssVar('bg-color', 'overlay');
          }
        }
      }
      & .#{$namespace}-menu {
        & .#{$namespace}-menu-item,
        & .#{$namespace}-sub-menu__title {
          background-color: getCssVar('menu-bg-color');
          display: flex;
          align-items: center;
          height: getCssVar('menu-horizontal-sub-item-height');
          line-height: getCssVar('menu-horizontal-sub-item-height');
          padding: 0 10px;
          color: getCssVar('menu-text-color');
        }

        & .#{$namespace}-sub-menu__title {
          padding-right: 40px;
        }

        & .#{$namespace}-menu-item.is-active,
        & .#{$namespace}-sub-menu.is-active > .#{$namespace}-sub-menu__title {
          color: getCssVar('menu-active-color');
        }
      }
      & .#{$namespace}-menu-item:not(.is-disabled):hover,
      & .#{$namespace}-menu-item:not(.is-disabled):focus {
        outline: none;
        color: getCssVar('menu-hover-text-color');
        background-color: getCssVar('menu-hover-bg-color');
      }
      & > .#{$namespace}-menu-item.is-active {
        border-bottom: 2px solid getCssVar('menu-active-color');
        color: getCssVar('menu-active-color') !important;
      }
    }
    @include m(collapse) {
      width: calc(#{getCssVar('menu-icon-width')} + #{getCssVar('menu-base-level-padding')} * 2);

      > .#{$namespace}-menu-item,
      > .#{$namespace}-sub-menu > .#{$namespace}-sub-menu__title,
      > .#{$namespace}-menu-item-group
        > ul
        > .#{$namespace}-sub-menu
        > .#{$namespace}-sub-menu__title {
        [class^='#{$namespace}-icon'] {
          margin: 0;
          vertical-align: middle;
          width: getCssVar('menu-icon-width');
          text-align: center;
        }

        .#{$namespace}-sub-menu__icon-arrow {
          display: none;
        }

        > span {
          height: 0;
          width: 0;
          overflow: hidden;
          visibility: hidden;
          display: inline-block;
        }
      }

      > .#{$namespace}-menu-item.is-active i {
        color: inherit;
      }

      .#{$namespace}-menu .#{$namespace}-sub-menu {
        min-width: 200px;
      }
    }
    @include m(popup) {
      z-index: 100;
      min-width: 200px;
      border: none;
      padding: 5px 0;
      border-radius: getCssVar('border-radius-small');
      box-shadow: getCssVar('box-shadow-light');
    }

    .#{$namespace}-icon {
      flex-shrink: 0;
    }
  }

  @include b(menu-item) {
    @include menu-item;

    & [class^='#{$namespace}-icon'] {
      margin-right: 5px;
      width: getCssVar('menu-icon-width');
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
    @include when(active) {
      color: getCssVar('menu-active-color');
      background-color: getCssVar('menu-active-bg-color');
      i {
        color: inherit;
      }
    }
    .#{$namespace}-menu-tooltip__trigger {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 getCssVar('menu-base-level-padding');
    }
  }

  @include b(sub-menu) {
    list-style: none;
    margin: 0;
    padding-left: 0;

    @include e(title) {
      @include menu-item;
      padding-right: calc(
        #{getCssVar('menu-base-level-padding')} + #{getCssVar('menu-icon-width')}
      );

      &:hover {
        background-color: getCssVar('menu-hover-bg-color');
      }
    }
    & .#{$namespace}-menu {
      border: none;
      padding: 0;
    }
    & .#{$namespace}-menu-item {
      height: getCssVar('menu-sub-item-height');
      line-height: getCssVar('menu-sub-item-height');
    }
    @include e(hide-arrow) {
      .#{$namespace}-sub-menu__icon-arrow {
        display: none !important;
      }
    }
    @include when(active) {
      .#{$namespace}-sub-menu__title {
        border-bottom-color: getCssVar('menu-active-color');
      }
    }
    @include when(disabled) {
      .#{$namespace}-sub-menu__title,
      .#{$namespace}-menu-item {
        opacity: 0.25;
        cursor: not-allowed;
        background: none !important;
      }
    }
    .#{$namespace}-icon {
      vertical-align: middle;
      margin-right: 5px;
      width: getCssVar('menu-icon-width');
      text-align: center;
      font-size: 18px;

      &.#{$namespace}-sub-menu__icon-more {
        margin-right: 0 !important;
      }
    }
    .#{$namespace}-sub-menu__icon-arrow {
      position: absolute;
      top: 50%;
      right: getCssVar('menu-base-level-padding');
      margin-top: -6px;
      transition: transform getCssVar('transition-duration');
      font-size: 12px;
      margin-right: 0;
      width: inherit;
    }
  }

  @include b(menu-item-group) {
    > ul {
      padding: 0;
    }
    @include e(title) {
      padding: 7px 0 7px getCssVar('menu-base-level-padding');
      line-height: normal;
      font-size: 12px;
      color: getCssVar('text-color', 'secondary');
    }
  }

  .horizontal-collapse-transition
    .#{$namespace}-sub-menu__title
    .#{$namespace}-sub-menu__icon-arrow {
    transition: getCssVar('transition-duration-fast');
    opacity: 0;
  }
</style>
