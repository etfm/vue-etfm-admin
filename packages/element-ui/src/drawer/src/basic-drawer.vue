<script setup lang="ts">
  import { computed, getCurrentInstance, nextTick, ref, toRaw, unref, useAttrs, watch } from 'vue';
  import type { DrawerInstance, IDrawer } from './typing';
  import { useNamespace } from '@etfm/hooks';
  import { deepMerge, lodash } from '@etfm/shared';
  import DrawerFooter from './components/drawer-footer.vue';
  import DrawerHeader from './components/drawer-header.vue';
  import { ElDrawer } from 'element-plus';
  import { ElScrollbar, DrawerProps } from 'element-plus';
  import { drawerProps } from './props';

  const emit = defineEmits<{
    'visible-change': [visible: boolean];
    ok: [];
    close: [e: any];
    register: [instance: DrawerInstance, uid: number];
  }>();

  const props = defineProps(drawerProps);
  const visibleRef = ref(false);
  const attrs = useAttrs();
  const propsRef = ref<Partial<IDrawer> | null>(null);

  const ns = useNamespace('basic-drawer');

  const drawerInstance: DrawerInstance = {
    setDrawerProps: setDrawerProps as any,
    emitVisible: undefined,
  };

  const instance = getCurrentInstance();

  instance && emit('register', drawerInstance, instance.uid);

  const getMergeProps = computed((): IDrawer => {
    return deepMerge(toRaw(props), unref(propsRef)) as any;
  });

  const getProps = computed((): IDrawer => {
    const opt = {
      ...unref(attrs),
      ...unref(getMergeProps),
      visible: unref(visibleRef),
    };
    opt.title = undefined;
    // const { isDetail, width, wrapClassName, getContainer } = opt;
    // if (isDetail) {
    //   if (!width) {
    //     opt.width = '100%';
    //   }
    //   const detailCls = `${prefixCls}__detail`;
    //   opt.class = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

    //   if (!getContainer) {
    //     // TODO type error?
    //     opt.getContainer = `.${prefixVar}-layout-content` as any;
    //   }
    // }
    return opt;
  });

  const getBindValues = computed(() => {
    return {
      ...attrs,
      ...unref(getProps),
    } as DrawerProps;
  });

  // Custom implementation of the bottom button,
  const getFooterHeight = computed(() => {
    const { footerHeight, showFooter } = unref(getProps);
    if (showFooter && footerHeight) {
      return lodash.isNumber(footerHeight)
        ? `${footerHeight}px`
        : `${footerHeight.replace('px', '')}px`;
    }
    return `0px`;
  });

  // const getLoading = computed(() => {
  //   return !!unref(getProps)?.loading;
  // });

  watch(
    () => props.visible,
    (newVal, oldVal) => {
      if (newVal !== oldVal) visibleRef.value = newVal;
    },
    { deep: true },
  );

  watch(
    () => visibleRef.value,
    (visible) => {
      nextTick(() => {
        emit('visible-change', visible);
        instance && drawerInstance.emitVisible?.(visible, instance.uid);
      });
    },
  );

  // Cancel event
  async function onClose(e) {
    const { closeFunc } = unref(getProps);
    emit('close', e);
    if (closeFunc && lodash.isFunction(closeFunc)) {
      const res = await closeFunc();
      visibleRef.value = !res;
      return;
    }
    visibleRef.value = false;
  }

  function setDrawerProps(props: Partial<IDrawer>): void {
    // Keep the last setDrawerProps
    propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);

    if (Reflect.has(props, 'visible')) {
      visibleRef.value = !!props.visible;
    }
  }

  function handleOk() {
    emit('ok');
  }
</script>

<template>
  <ElDrawer :class="ns.b()" @close="onClose" v-bind="getBindValues" v-model="visibleRef">
    <template #header v-if="!$slots.header">
      <DrawerHeader
        :title="getMergeProps.title"
        :isDetail="isDetail"
        :showDetailBack="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar"></slot>
        </template>
      </DrawerHeader>
    </template>
    <template v-else #header>
      <slot name="header"></slot>
    </template>

    <ElScrollbar :loading-tip="loadingText || '加载中...'">
      <slot></slot>
    </ElScrollbar>

    <template #footer>
      <DrawerFooter v-bind="getProps" @close="onClose" @ok="handleOk" :height="getFooterHeight">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </DrawerFooter>
    </template>
  </ElDrawer>
</template>
<style lang="scss" module>
  @include b(basic-drawer) {
  }
</style>
