<template>
  <ul
    :ref="dropdownListWrapperRef"
    :class="dropdownKls"
    :style="rovingFocusGroupRootStyle"
    :tabindex="-1"
    :role="role"
    :aria-labelledby="triggerId"
    @blur="onBlur"
    @focus="onFocus"
    @keydown.self="handleKeydown"
    @mousedown.self="onMousedown"
  >
    <slot />
  </ul>
</template>
<script lang="ts">
  import { computed, defineComponent, inject, unref } from 'vue';
  import { EVENT_CODE, FOCUS_TRAP_INJECTION_KEY } from '../../focus-trap';
  import {
    ROVING_FOCUS_COLLECTION_INJECTION_KEY,
    ROVING_FOCUS_GROUP_INJECTION_KEY,
    focusFirst,
  } from '../../roving-focus-group';
  import { DROPDOWN_INJECTION_KEY } from './tokens';
  import {
    DROPDOWN_COLLECTION_INJECTION_KEY,
    FIRST_LAST_KEYS,
    LAST_KEYS,
    dropdownMenuProps,
  } from './dropdown';
  import { useDropdown } from './useDropdown';
  import { useNamespace } from '@etfma/hooks';
  import { composeEventHandlers, composeRefs } from '@etfma/shared';

  export default defineComponent({
    name: 'ElDropdownMenu',
    props: dropdownMenuProps,
    setup(props) {
      const ns = useNamespace('dropdown');
      const { _elDropdownSize } = useDropdown();
      const size = _elDropdownSize.value;

      const { focusTrapRef, onKeydown } = inject(FOCUS_TRAP_INJECTION_KEY, undefined)!;

      const { contentRef, role, triggerId } = inject(DROPDOWN_INJECTION_KEY, undefined)!;

      const { collectionRef: dropdownCollectionRef, getItems } = inject(
        DROPDOWN_COLLECTION_INJECTION_KEY,
        undefined,
      )!;

      const {
        rovingFocusGroupRef,
        rovingFocusGroupRootStyle,
        tabIndex,
        onBlur,
        onFocus,
        onMousedown,
      } = inject(ROVING_FOCUS_GROUP_INJECTION_KEY, undefined)!;

      const { collectionRef: rovingFocusGroupCollectionRef } = inject(
        ROVING_FOCUS_COLLECTION_INJECTION_KEY,
        undefined,
      )!;

      const dropdownKls = computed(() => {
        return [ns.b('menu'), ns.bm('menu', size?.value)];
      });

      const dropdownListWrapperRef = composeRefs(
        contentRef,
        dropdownCollectionRef,
        focusTrapRef,
        rovingFocusGroupRef,
        rovingFocusGroupCollectionRef,
      );

      const composedKeydown = composeEventHandlers(
        (e: KeyboardEvent) => {
          props.onKeydown?.(e);
        },
        (e) => {
          const { currentTarget, code, target } = e;
          const isKeydownContained = (currentTarget as Node).contains(target as Node);

          if (isKeydownContained) {
            // TODO: implement typeahead search
          }

          if (EVENT_CODE.tab === code) {
            e.stopImmediatePropagation();
          }

          e.preventDefault();

          if (target !== unref(contentRef)) return;
          if (!FIRST_LAST_KEYS.includes(code)) return;
          const items = getItems<{ disabled: boolean }>().filter((item) => !item.disabled);
          const targets = items.map((item) => item.ref!);
          if (LAST_KEYS.includes(code)) {
            targets.reverse();
          }
          focusFirst(targets);
        },
      );

      const handleKeydown = (e: KeyboardEvent) => {
        composedKeydown(e);
        onKeydown(e);
      };

      return {
        size,
        rovingFocusGroupRootStyle,
        tabIndex,
        dropdownKls,
        role,
        triggerId,
        dropdownListWrapperRef,
        handleKeydown,
        onBlur,
        onFocus,
        onMousedown,
      };
    },
  });
</script>

<style lang="scss" module>
  @use 'sass:map';

  @include b(dropdown-menu) {
    position: relative;
    top: 0;
    left: 0;
    z-index: getCssVar('dropdown-menu-index');
    padding: map.get($dropdown-menu-padding-vertical, 'default')-$border-width 0;
    margin: 0;
    list-style: none;
    background-color: getCssVar('bg-color', 'overlay');
    border: none;
    border-radius: getCssVar('border-radius-base');
    box-shadow: none;

    @each $size in (large, small) {
      @include b(dropdown-menu) {
        @include m($size) {
          padding: map.get($dropdown-menu-padding-vertical, $size)-$border-width 0;
        }
      }
    }
  }
</style>
<style lang="scss">
  @use 'sass:map';

  @each $size, $index in ('large': '14', 'small': '18') {
    ._dropdown-menu_1wtvq_1 {
      &._dropdown-menu--#{$size}_1wtvq_#{$index} {
        ._dropdown-menu__item_wa026_1 {
          padding: map.get($dropdown-item-padding, $size);
          font-size: map.get($input-font-size, $size);
          line-height: map.get($dropdown-item-line-height, $size);

          ._dropdown-menu__item--divided_wa026_14 {
            margin: map.get($dropdown-item-divided-margin, $size);
          }
        }
      }
    }
  }
</style>
