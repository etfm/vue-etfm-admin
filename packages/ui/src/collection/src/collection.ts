import { inject, onBeforeUnmount, onMounted, provide, ref, unref, defineComponent } from 'vue';
import type { InjectionKey } from 'vue';
import type { SetupContext, Slots } from '@vue/runtime-core';
import type { ElCollectionInjectionContext, ElCollectionItemInjectionContext } from './tokens';

export const COLLECTION_ITEM_SIGN = `data-el-collection-item`;

// Make sure the first letter of name is capitalized
export const createCollectionWithScope = (name: string) => {
  const COLLECTION_NAME = `El${name}Collection`;
  const COLLECTION_ITEM_NAME = `${COLLECTION_NAME}Item`;
  const COLLECTION_INJECTION_KEY: InjectionKey<ElCollectionInjectionContext> =
    Symbol(COLLECTION_NAME);
  const COLLECTION_ITEM_INJECTION_KEY: InjectionKey<ElCollectionItemInjectionContext> =
    Symbol(COLLECTION_ITEM_NAME);

  const ElCollection = defineComponent({
    name: COLLECTION_NAME,
    inheritAttrs: false,
    setup(_) {
      const collectionRef = ref<HTMLElement | null>(null);
      const itemMap: ElCollectionInjectionContext['itemMap'] = new Map();
      const getItems = () => {
        const collectionEl = unref(collectionRef);

        if (!collectionEl) return [];
        const orderedNodes = Array.from(collectionEl.querySelectorAll(`[${COLLECTION_ITEM_SIGN}]`));

        const items = [...itemMap.values()];

        return items.sort((a, b) => orderedNodes.indexOf(a.ref!) - orderedNodes.indexOf(b.ref!));
      };

      provide(COLLECTION_INJECTION_KEY, {
        itemMap,
        getItems,
        collectionRef,
      });
    },
    render() {
      return getSlot(this.$slots);
    },
  });

  const ElCollectionItem = defineComponent({
    name: COLLECTION_ITEM_NAME,
    inheritAttrs: false,
    setup(_: unknown, { attrs }: SetupContext) {
      const collectionItemRef = ref<HTMLElement | null>(null);
      const collectionInjection = inject(COLLECTION_INJECTION_KEY, undefined)!;

      provide(COLLECTION_ITEM_INJECTION_KEY, {
        collectionItemRef,
      });

      onMounted(() => {
        const collectionItemEl = unref(collectionItemRef);
        if (collectionItemEl) {
          collectionInjection.itemMap.set(collectionItemEl, {
            ref: collectionItemEl,
            ...attrs,
          });
        }
      });

      onBeforeUnmount(() => {
        const collectionItemEl = unref(collectionItemRef)!;
        collectionInjection.itemMap.delete(collectionItemEl);
      });
    },

    render() {
      return getSlot(this.$slots);
    },
  });

  return {
    COLLECTION_INJECTION_KEY,
    COLLECTION_ITEM_INJECTION_KEY,
    ElCollection,
    ElCollectionItem,
  };
};

function getSlot(slots: Slots, slot = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  const slotFn = slots[slot];
  if (!slotFn) return null;
  return slotFn(data);
}
