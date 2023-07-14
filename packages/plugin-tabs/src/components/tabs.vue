<script lang="ts" setup>
  import { useNamespace } from '@etfma/hooks';
  import { computed, onBeforeUnmount, ref, unref } from 'vue';
  import useOffsets from '../hooks/use-offsets';
  import useTouchMove from '../hooks/use-touch-move';
  import { useGetTabPane } from '../hooks/use-get-tabs';
  import { EtfmaIcon, EtfmaDropdown, EtfmaDropdownItem, EtfmaDropdownMenu } from '@etfma/etfma-ui';
  import More from '../icon/more.vue';
  import { useHiddenTabs } from '../hooks/use-hidden-tabs';
  import { useResize } from '../hooks/use-resize';
  import { useScroll } from '../hooks/use-scroll';
  import { useTransformVlaue } from '../hooks/use-transform-value';
  import Close from '../icon/close.vue';
  import { lodash } from '@etfma/shared';

  defineOptions({
    name: 'Tabs',
  });

  interface Props {
    /**
     * key
     * @default ''
     */
    activeKey: string | number;
    /**
     * 固定的项，不能进行删除
     */
    affix?: string | string[];
  }

  const props = withDefaults(defineProps<Props>(), {});

  const emit = defineEmits<{
    tabClick: [key: string];
    'dropdown-remove': [key: string];
  }>();

  const ns = useNamespace('tabs');

  const transformLeft = ref(0);
  const touchMovingRef = ref();
  const dropdownRef = ref();

  const affixs = computed(() => {
    if (props.affix) {
      return lodash.isArray(props.affix) ? props.affix : [props.affix];
    } else {
      return [];
    }
  });

  const { tabs } = useGetTabPane({ tabClick: handleClick });

  const { tabListRef, tabSizes, tabsWrapperRef, wrapperScrollWidth, wrapperWidth } = useResize({
    tabs,
    props,
  });

  const tabOffsets = useOffsets(tabs, tabSizes);

  const { alignInRange } = useTransformVlaue({ wrapperScrollWidth, wrapperWidth });

  const { scrollToTab } = useScroll({
    props,
    wrapperWidth,
    tabOffsets,
    tabs,
    transformLeft,
    alignInRange,
  });

  const { hiddenTabs } = useHiddenTabs({
    tabs,
    tabOffsets,
    transformLeft,
    wrapperWidth,
  });

  const isVisible = computed(() => unref(hiddenTabs).length > 0);

  useTouchMove(tabsWrapperRef, (offsetX) => {
    if (wrapperWidth.value >= wrapperScrollWidth.value) {
      return false;
    }

    transformLeft.value = alignInRange(transformLeft.value + offsetX);

    clearTouchMoving();

    return true;
  });

  onBeforeUnmount(() => {
    clearTouchMoving();
  });

  // 清除移动
  function clearTouchMoving() {
    clearTimeout(touchMovingRef.value);
  }

  // 执行点击事件
  function handleClick(key: string) {
    emit('tabClick', key);
    scrollToTab(key);
  }

  // 删除Dropdown下面的莫一项
  async function handleDropdownRemove(key: string) {
    unref(dropdownRef).handleClose();
    emit('dropdown-remove', key);
    scrollToTab(key);
  }
</script>

<template>
  <div :class="ns.b()">
    <slot name="left" />
    <div ref="tabsWrapperRef" :class="ns.b('wrap')">
      <div
        ref="tabListRef"
        :class="[ns.b('wrap-list')]"
        :style="{
          transform: `translate(${transformLeft}px, 0px)`,
        }"
      >
        <slot />
      </div>
    </div>
    <EtfmaDropdown ref="dropdownRef" v-if="isVisible" :max-height="140" @command="handleClick">
      <div :class="[ns.b('icon')]">
        <EtfmaIcon>
          <More />
        </EtfmaIcon>
      </div>
      <template #dropdown>
        <EtfmaDropdownMenu>
          <EtfmaDropdownItem v-for="item in hiddenTabs" :command="item.key">
            <div :class="[ns.b('dropdown-oper')]">
              {{ item.title }}
              <EtfmaIcon
                v-if="!affixs.includes(item.key)"
                :class="ns.b('dropdown-icon')"
                @click.stop="handleDropdownRemove(item.key)"
              >
                <Close />
              </EtfmaIcon>
            </div>
          </EtfmaDropdownItem>
        </EtfmaDropdownMenu>
      </template>
    </EtfmaDropdown>
    <slot name="right" />
  </div>
</template>
<style scoped lang="scss">
  @include b(tabs) {
    display: flex;
    flex: 1;
    align-items: center;
    justify-items: center;

    @include b(tabs-wrap) {
      position: relative;
      display: inline-block;
      display: flex;
      flex: auto;
      align-self: stretch;
      overflow: hidden;
      white-space: nowrap;
      transform: translate(0);
    }

    @include b(tabs-wrap-list) {
      position: relative;
      display: flex;
      white-space: nowrap;
      transition: transform 0.3s;
    }

    @include b(tabs-icon) {
      padding: 0 16px;
      cursor: pointer;
      outline: none;
    }
  }

  @include b(tabs-dropdown-oper) {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    @include b(tabs-dropdown-icon) {
      margin-left: 4px;
      cursor: pointer;
    }
  }
</style>