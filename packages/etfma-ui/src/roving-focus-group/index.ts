// This component is ported from https://github.com/radix-ui/primitives/tree/main/packages/react/roving-focus
// with some modification for Vue
import EtfmaRovingFocusGroup from './src/roving-focus-group.vue';
import EtfmaRovingFocusItem from './src/roving-focus-item.vue';

export { EtfmaRovingFocusGroup, EtfmaRovingFocusItem };

export * from './src/tokens';
export * from './src/utils';

export {
  ROVING_FOCUS_COLLECTION_INJECTION_KEY,
  ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
} from './src/roving-focus-group';

export default EtfmaRovingFocusGroup;
