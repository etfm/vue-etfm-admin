<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <el-tooltip
      ref="popperRef"
      :role="role"
      :effect="effect"
      :fallback-placements="['bottom', 'top']"
      :popper-options="popperOptions"
      :gpu-acceleration="false"
      :hide-after="trigger === 'hover' ? hideTimeout : 0"
      :manual-mode="true"
      :placement="placement"
      :popper-class="[ns.e('popper'), popperClass]"
      :reference-element="referenceElementRef?.$el"
      :trigger="trigger"
      :trigger-keys="triggerKeys"
      :trigger-target-el="contentRef"
      :show-after="trigger === 'hover' ? showTimeout : 0"
      :stop-popper-mouse-event="false"
      :virtual-ref="triggeringElementRef"
      :disabled="disabled"
      :transition="`zoom-in-top`"
      :teleported="teleported"
      pure
      persistent
      @before-show="handleBeforeShowTooltip"
      @show="handleShowTooltip"
      @before-hide="handleBeforeHideTooltip"
    >
      <template #content>
        <el-scrollbar ref="scrollbar" :wrap-style="wrapStyle" tag="div" :view-class="ns.e('list')">
          <el-roving-focus-group
            :loop="loop"
            :current-tab-id="currentTabId"
            orientation="horizontal"
            @current-tab-id-change="handleCurrentTabIdChange"
            @entry-focus="handleEntryFocus"
          >
            <el-dropdown-collection>
              <slot name="dropdown" />
            </el-dropdown-collection>
          </el-roving-focus-group>
        </el-scrollbar>
      </template>
      <template #default>
        <EtfmaOnlyChild
          :id="triggerId"
          ref="triggeringElementRef"
          role="button"
          :tabindex="tabindex"
        >
          <slot name="default" />
        </EtfmaOnlyChild>
      </template>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    onBeforeUnmount,
    provide,
    ref,
    toRef,
    unref,
    watch,
  } from 'vue';
  import ElTooltip from '../../tooltip';
  import ElScrollbar from '../../scrollbar';
  import ElIcon from '../../icon';
  import ElRovingFocusGroup from '../../roving-focus-group';
  import { EtfmaOnlyChild } from '../../slot';
  import { ArrowDown } from '@element-plus/icons-vue';
  import { ElCollection as ElDropdownCollection, dropdownProps } from './dropdown';
  import { DROPDOWN_INJECTION_KEY } from './tokens';

  import type { CSSProperties } from 'vue';
  import { useId, useNamespace } from '@etfma/hooks';
  import { EVENT_CODE } from '../../focus-trap';
  import { addUnit, lodash } from '@etfma/shared';

  export default defineComponent({
    name: 'EtfmDropdown',
    components: {
      ElScrollbar,
      ElDropdownCollection,
      ElTooltip,
      ElRovingFocusGroup,
      EtfmaOnlyChild,
      ElIcon,
      ArrowDown,
    },
    props: dropdownProps,
    emits: ['visible-change', 'click', 'command'],
    setup(props, { emit }) {
      const _instance = getCurrentInstance();
      const ns = useNamespace('dropdown', { isCssModule: false });

      const triggeringElementRef = ref();
      const referenceElementRef = ref();
      const popperRef = ref<InstanceType<typeof ElTooltip> | null>(null);
      const contentRef = ref<HTMLElement | null>(null);
      const scrollbar = ref(null);
      const currentTabId = ref<string | null>(null);
      const isUsingKeyboard = ref(false);
      const triggerKeys = [EVENT_CODE.enter, EVENT_CODE.space, EVENT_CODE.down];

      const wrapStyle = computed<CSSProperties>(() => ({
        maxHeight: addUnit(props.maxHeight),
      }));
      const dropdownTriggerKls = computed(() => [ns.m(dropdownSize.value)]);

      const defaultTriggerId = useId().value;
      const triggerId = computed<string>(() => {
        return props.id || defaultTriggerId;
      });

      // The goal of this code is to focus on the tooltip triggering element when it is hovered.
      // This is a temporary fix for where closing the dropdown through pointerleave event focuses on a
      // completely different element. For a permanent solution, remove all calls to any "element.focus()"
      // that are triggered through pointer enter/leave events.
      watch(
        [triggeringElementRef, toRef(props, 'trigger')],
        ([triggeringElement, trigger], [prevTriggeringElement]) => {
          const triggerArray = lodash.isArray(trigger) ? trigger : [trigger];
          if (prevTriggeringElement?.$el?.removeEventListener) {
            prevTriggeringElement.$el.removeEventListener('pointerenter', onAutofocusTriggerEnter);
          }
          if (triggeringElement?.$el?.removeEventListener) {
            triggeringElement.$el.removeEventListener('pointerenter', onAutofocusTriggerEnter);
          }
          if (triggeringElement?.$el?.addEventListener && triggerArray.includes('hover')) {
            triggeringElement.$el.addEventListener('pointerenter', onAutofocusTriggerEnter);
          }
        },
        { immediate: true },
      );

      onBeforeUnmount(() => {
        if (triggeringElementRef.value?.$el?.removeEventListener) {
          triggeringElementRef.value.$el.removeEventListener(
            'pointerenter',
            onAutofocusTriggerEnter,
          );
        }
      });

      function handleClick() {
        handleClose();
      }

      function handleClose() {
        popperRef.value?.onClose();
      }

      function handleOpen() {
        popperRef.value?.onOpen();
      }

      const dropdownSize = computed(() => props.size);

      function commandHandler(...args: any[]) {
        emit('command', ...args);
      }

      function onAutofocusTriggerEnter() {
        triggeringElementRef.value?.$el?.focus();
      }

      function onItemEnter() {
        // NOOP for now
      }

      function onItemLeave() {
        const contentEl = unref(contentRef);

        contentEl?.focus();
        currentTabId.value = null;
      }

      function handleCurrentTabIdChange(id: string) {
        currentTabId.value = id;
      }

      function handleEntryFocus(e: Event) {
        if (!isUsingKeyboard.value) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }

      function handleBeforeShowTooltip() {
        emit('visible-change', true);
      }

      function handleShowTooltip(event?: Event) {
        if (event?.type === 'keydown') {
          unref(contentRef)?.focus();
        }
      }

      function handleBeforeHideTooltip() {
        emit('visible-change', false);
      }

      provide(DROPDOWN_INJECTION_KEY, {
        contentRef,
        role: computed(() => props.role),
        triggerId,
        isUsingKeyboard,
        onItemEnter,
        onItemLeave,
      });

      provide('etfmDropdown', {
        instance: _instance,
        dropdownSize,
        handleClick,
        commandHandler,
        trigger: toRef(props, 'trigger'),
        hideOnClick: toRef(props, 'hideOnClick'),
      });

      const onFocusAfterTrapped = (e: Event) => {
        e.preventDefault();
        contentRef.value?.focus?.({
          preventScroll: true,
        });
      };

      const handlerMainButtonClick = (event: MouseEvent) => {
        emit('click', event);
      };

      return {
        ns,
        scrollbar,
        wrapStyle,
        dropdownTriggerKls,
        dropdownSize,
        triggerId,
        triggerKeys,
        currentTabId,
        handleCurrentTabIdChange,
        handlerMainButtonClick,
        handleEntryFocus,
        handleClose,
        handleOpen,
        handleBeforeShowTooltip,
        handleShowTooltip,
        handleBeforeHideTooltip,
        onFocusAfterTrapped,
        popperRef,
        contentRef,
        triggeringElementRef,
        referenceElementRef,
      };
    },
  });
</script>
<style lang="scss">
  @use 'sass:map';

  @include b(dropdown) {
    @include set-component-css-var('dropdown', $dropdown);

    display: inline-flex;
    position: relative;
    color: getCssVar('text-color', 'regular');
    font-size: getCssVar('font-size', 'base');
    line-height: 1;
    vertical-align: top;

    &.is-disabled {
      color: getCssVar('text-color', 'placeholder');
      cursor: not-allowed;
    }

    @include e(popper) {
      @include set-component-css-var('dropdown', $dropdown);

      // using attributes selector to override

      @include picker-popper(
        getCssVar('bg-color', 'overlay'),
        1px solid getCssVar('border-color-light'),
        getCssVar('dropdown-menu-box-shadow')
      );

      .#{$namespace}-dropdown-menu {
        border: none;
      }

      #{& + '-selfdefine'} {
        outline: none;
      }

      @include b(scrollbar__bar) {
        z-index: calc(#{getCssVar('dropdown', 'menu-index')} + 1);
      }

      @include b(dropdown__list) {
        list-style: none;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
    }

    & .#{$namespace}-dropdown__caret-button {
      padding-left: 0;
      padding-right: 0;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: map.get($dropdown-caret-width, 'default');
      border-left: none;

      > span {
        display: inline-flex;
      }

      &::before {
        content: '';
        position: absolute;
        display: block;
        width: 1px;
        top: -1px;
        bottom: -1px;
        left: 0;
        background: getCssVar('overlay-color', 'lighter');
      }

      &.#{$namespace}-button::before {
        background: getCssVar('border-color');
        opacity: 0.5;
      }

      & .#{$namespace}-dropdown__icon {
        font-size: inherit;
        padding-left: 0;
      }
    }

    .#{$namespace}-dropdown-selfdefine {
      // 自定义
      outline: none;
    }

    @each $size in (large, small) {
      @include m($size) {
        .#{$namespace}-dropdown__caret-button {
          width: map.get($dropdown-caret-width, $size);
        }
      }
    }
  }

  $dropdown-menu-padding-vertical: () !default;
  $dropdown-menu-padding-vertical: map.merge(
    (
      'large': 8px,
      'default': 6px,
      'small': 4px,
    ),
    $dropdown-menu-padding-vertical
  );

  @include b(dropdown-menu) {
    position: relative;
    top: 0;
    left: 0;
    z-index: getCssVar('dropdown-menu-index');
    padding: map.get($dropdown-menu-padding-vertical, 'default')-$border-width 0;
    margin: 0;
    background-color: getCssVar('bg-color', 'overlay');
    border: none;
    border-radius: getCssVar('border-radius-base');
    box-shadow: none;
    list-style: none;

    @include e(item) {
      display: flex;
      align-items: center;
      white-space: nowrap;
      list-style: none;
      line-height: map.get($dropdown-item-line-height, 'default');
      padding: map.get($dropdown-item-padding, 'default');
      margin: 0;
      font-size: getCssVar('font-size', 'base');
      color: getCssVar('text-color', 'regular');
      cursor: pointer;
      outline: none;
      &:not(.is-disabled):focus {
        background-color: getCssVar('dropdown-menuItem-hover-fill');
        color: getCssVar('dropdown-menuItem-hover-color');
      }

      i {
        margin-right: 5px;
      }

      @include m(divided) {
        margin: map.get($dropdown-item-divided-margin, 'default');
        border-top: 1px solid getCssVar('border-color-lighter');
      }

      @include when(disabled) {
        cursor: not-allowed;
        color: getCssVar('text-color-disabled');
      }
    }

    @each $size in (large, small) {
      @include m($size) {
        padding: map.get($dropdown-menu-padding-vertical, $size)-$border-width 0;

        @include e(item) {
          padding: map.get($dropdown-item-padding, $size);
          line-height: map.get($dropdown-item-line-height, $size);
          font-size: map.get($input-font-size, $size);

          @include m(divided) {
            margin: map.get($dropdown-item-divided-margin, $size);
          }
        }
      }
    }
  }
</style>
