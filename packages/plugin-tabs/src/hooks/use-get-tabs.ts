import { ref, unref } from 'vue';
import { createTabsProviderContext } from '../constants';
import { Fn } from '@etfma/types';

export interface Tabs {
  key: string;
  name: string;
  title: string;
  $el: HTMLElement;
  [key: string]: any;
}

export function useGetTabPane({ tabClick }: { tabClick: Fn }) {
  const tabs = ref<Tabs[]>([]);

  const registerPane = (instance) => {
    const node = instance.vnode;
    const props = node.props;

    tabs.value.push({
      key: props.name,
      ...props,
      $el: node.el,
    });
  };

  const unregisterPane = (key) => {
    tabs.value = unref(tabs).filter((item) => item.key != key);
  };

  createTabsProviderContext({ registerPane, tabClick: tabClick, unregisterPane });

  return {
    tabs,
  };
}
