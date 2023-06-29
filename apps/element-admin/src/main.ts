import '@etfma/design';
import 'uno.css';

import { plugins, init, skeleton } from '@etfma/core';
import type { IPublicPluginContext, IPublicTypePlugin } from '@etfma/core';
import Analysis from '@/views/dashboard/analysis/index.vue';
import { h } from 'vue';
import LayoutSider from '@/layouts/sider/layout-sider.vue';

async function boostrap() {
  const buildSkeleton: IPublicTypePlugin = (_: IPublicPluginContext) => {
    return {
      name: 'TextPlugin',
      init() {
        skeleton.add({
          area: 'header',
          type: 'Widget',
          name: 'topArea',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'aside',
          type: 'Widget',
          name: 'leftArea',
          content: h(LayoutSider, {
            isCollapse: false,
            layout: 'side-nav',
          }),
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'footer',
          type: 'Widget',
          name: 'bottomArea',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'toolbar',
          type: 'Widget',
          name: 'toolbar',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'breadcrumb',
          type: 'Widget',
          name: 'toolbarTop',
          content: '1212',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'main',
          type: 'Widget',
          name: 'mainArea',
          content: h(Analysis),
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'float',
          type: 'Widget',
          name: 'leftFixedArea',
          content: h('div', 'logologologologologologologologologol'),
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            enableDrag: true,
          },
        });
      },
    };
  };

  buildSkeleton.pluginName = 'TextPlugin';

  await plugins.register(buildSkeleton);

  init(document.getElementById('app')!);
}

boostrap();
