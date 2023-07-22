<template>
  <li v-if="divided" role="separator" :class="ns.bem('menu', 'item', 'divided')" v-bind="$attrs" />
  <li
    :ref="itemRef"
    v-bind="{ ...dataset, ...$attrs }"
    :aria-disabled="disabled"
    :class="[ns.be('menu', 'item'), ns.is('disabled', disabled)]"
    :tabindex="tabIndex"
    :role="role"
    @click="(e) => $emit('clickimpl', e)"
    @focus="handleFocus"
    @keydown.self="handleKeydown"
    @mousedown="handleMousedown"
    @pointermove="(e) => $emit('pointermove', e)"
    @pointerleave="(e) => $emit('pointerleave', e)"
  >
    <etfma-icon v-if="icon">
      <component :is="icon" />
    </etfma-icon>
    <slot />
  </li>
</template>

<script lang="ts">
  import { computed, defineComponent, inject } from 'vue';
  import {
    ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY,
    ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
  } from '../../roving-focus-group';
  import { COLLECTION_ITEM_SIGN } from '../../collection';
  import { EtfmaIcon } from '../../icon';
  import { DROPDOWN_COLLECTION_ITEM_INJECTION_KEY, dropdownItemProps } from './dropdown';
  import { DROPDOWN_INJECTION_KEY } from './tokens';
  import { useNamespace } from '@etfma/hooks';
  import { composeEventHandlers, composeRefs } from '@etfma/shared';
  import { EVENT_CODE } from '../../focus-trap';

  export default defineComponent({
    name: 'DropdownItemImpl',
    components: {
      EtfmaIcon,
    },
    props: dropdownItemProps,
    emits: ['pointermove', 'pointerleave', 'click', 'clickimpl'],
    setup(_, { emit }) {
      const ns = useNamespace('dropdown');

      const { role: menuRole } = inject(DROPDOWN_INJECTION_KEY, undefined)!;

      const { collectionItemRef: dropdownCollectionItemRef } = inject(
        DROPDOWN_COLLECTION_ITEM_INJECTION_KEY,
        undefined,
      )!;

      const { collectionItemRef: rovingFocusCollectionItemRef } = inject(
        ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
        undefined,
      )!;

      const {
        rovingFocusGroupItemRef,
        tabIndex,
        handleFocus,
        handleKeydown: handleItemKeydown,
        handleMousedown,
      } = inject(ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY, undefined)!;

      const itemRef = composeRefs(
        dropdownCollectionItemRef,
        rovingFocusCollectionItemRef,
        rovingFocusGroupItemRef,
      );

      const role = computed<string>(() => {
        if (menuRole.value === 'menu') {
          return 'menuitem';
        } else if (menuRole.value === 'navigation') {
          return 'link';
        }
        return 'button';
      });

      const handleKeydown = composeEventHandlers((e: KeyboardEvent) => {
        const { code } = e;
        if (code === EVENT_CODE.enter || code === EVENT_CODE.space) {
          e.preventDefault();
          e.stopImmediatePropagation();
          emit('clickimpl', e);
          return true;
        }
      }, handleItemKeydown);

      return {
        ns,
        itemRef,
        dataset: {
          [COLLECTION_ITEM_SIGN]: '',
        },
        role,
        tabIndex,
        handleFocus,

        handleKeydown,
        handleMousedown,
      };
    },
  });
</script>
<style lang="scss" module>
  @use 'sass:map';

  @include b(dropdown-menu) {
    @include e(item) {
      display: flex;
      align-items: center;
      padding: map.get($dropdown-item-padding, 'default');
      margin: 0;
      font-size: getCssVar('font-size', 'base');
      line-height: map.get($dropdown-item-line-height, 'default');
      color: getCssVar('text-color', 'regular');
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
      outline: none;

      @include m(divided) {
        margin: map.get($dropdown-item-divided-margin, 'default');
        border-top: 1px solid getCssVar('border-color-lighter');
      }

      @include when(disabled) {
        color: getCssVar('text-color-disabled');
        cursor: not-allowed;
      }

      &:not(.is-disabled):focus {
        color: getCssVar('dropdown-menuItem-hover-color');
        background-color: getCssVar('dropdown-menuItem-hover-fill');
      }

      i {
        margin-right: 5px;
      }
    }
  }
</style>
