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
      :virtual-triggering="splitButton"
      :disabled="disabled"
      :transition="`${ns.namespace.value}-zoom-in-top`"
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
  import { EVENT_CODE } from 'src/focus-trap';
  import { addUnit, lodash } from '@etfma/shared';

  export default defineComponent({
    name: 'ElDropdown',
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
      const ns = useNamespace('dropdown');

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

      provide('etfmaDropdown', {
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
