<template>
  <transition mode="out-in" v-bind="listeners">
    <slot />
  </transition>
</template>
<script lang="ts" setup>
  import { addClass, hasClass, removeClass } from '@etfma/shared';
  import { inject, type BaseTransitionProps, type TransitionProps } from 'vue';
  import { MenuProvider } from './types';

  defineOptions({
    name: 'EtfmMenuCollapseTransition',
  });

  const rootMenu = inject<MenuProvider>('rootMenu');

  const listeners = {
    onBeforeEnter: (el) => (el.style.opacity = '0.2'),
    onEnter(el, done) {
      addClass(el, `opacity-transition`);
      el.style.opacity = '1';
      done();
    },

    onAfterEnter(el) {
      removeClass(el, `opacity-transition`);
      el.style.opacity = '';
    },

    onBeforeLeave(el) {
      if (!el.dataset) {
        (el as any).dataset = {};
      }

      if (hasClass(el, rootMenu?.ns.nsMenu.m('collapse'))) {
        removeClass(el, rootMenu?.ns.nsMenu.m('collapse'));
        el.dataset.oldOverflow = el.style.overflow;
        el.dataset.scrollWidth = el.clientWidth.toString();
        addClass(el, rootMenu?.ns.nsMenu.m('collapse'));
      } else {
        addClass(el, rootMenu?.ns.nsMenu.m('collapse'));
        el.dataset.oldOverflow = el.style.overflow;
        el.dataset.scrollWidth = el.clientWidth.toString();
        removeClass(el, rootMenu?.ns.nsMenu.m('collapse'));
      }

      el.style.width = `${el.scrollWidth}px`;
      el.style.overflow = 'hidden';
    },

    onLeave(el: HTMLElement) {
      addClass(el, 'horizontal-collapse-transition');
      el.style.width = `${el.dataset.scrollWidth}px`;
    },
  } as BaseTransitionProps<HTMLElement> as TransitionProps;
</script>
