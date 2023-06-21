import '@etfma/design';
import 'uno.css';

// import '@etfma/render';

import { plugins, init, skeleton } from '@etfma/core';
import type { IPublicPluginContext, IPublicTypePlugin } from '@etfma/core';
import Workbench from '@/views/dashboard/workbench/index.vue';
import { h } from 'vue';

async function boostrap() {
  const buildSkeleton: IPublicTypePlugin = (ctx: IPublicPluginContext) => {
    return {
      name: 'TextPlugin',
      init() {
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'logo',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        skeleton.add({
          area: 'leftArea',
          type: 'Widget',
          name: 'logo',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        skeleton.add({
          area: 'rightArea',
          type: 'Widget',
          name: 'logo',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        skeleton.add({
          area: 'bottomArea',
          type: 'Widget',
          name: 'logo',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'toolbar',
          type: 'Widget',
          name: 'logo',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        skeleton.add({
          area: 'mainArea',
          type: 'Widget',
          name: 'mian',
          content: h(Workbench),
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        skeleton.add({
          area: 'leftFixedArea',
          type: 'Widget',
          name: 'logo',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
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
