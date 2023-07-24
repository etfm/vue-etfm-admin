<script setup lang="ts">
  import { ElSwitch, ElDivider, ElButton } from 'element-plus';
  import { reactive } from 'vue';
  import { skeleton } from '@etfma/core';
  import { useNamespace } from '@etfma/hooks';
  import {
    EtfmaTooltip,
    EtfmaDropdown,
    EtfmaDropdownItem,
    EtfmaDropdownMenu,
    EtfmaMenu,
    EtfmaSubMenu,
    EtfmaMenuItem,
    EtfmaBreadcrumb,
    EtfmaBreadcrumbItem,
    EtfmaTag,
  } from '@etfma/ui';
  import { ref } from 'vue';

  defineOptions({
    name: 'analysis',
    inheritAttrs: false,
  });

  const ns = useNamespace('analysis');

  const modelArea = reactive({
    isLeft: true,
    isHeader: true,
    isRight: true,
    isBottom: true,
    isToolbar: true,
    isLeftFixed: true,
    isLeftFloat: false,
  });

  const modelWidget = reactive({
    isLeft: true,
    isHeader: true,
    isRight: true,
    isBottom: true,
    isToolbar: true,
    isLeftFixed: true,
    isLeftFloat: false,
  });

  function handleArea(e, name) {
    if (e) {
      skeleton.showArea(name);
    } else {
      skeleton.hideArea(name);
    }
  }

  function handleWidget(e, name) {
    if (e) {
      skeleton.showWidget(name);
    } else {
      skeleton.hideWidget(name);
    }
  }

  skeleton.onHideWidget((name) => {
    console.log('监听隐藏widget事件', name);
  });

  skeleton.onShowWidget((name) => {
    console.log('监听显示widget事件', name);
  });

  skeleton.onHideArea((name) => {
    console.log('监听隐藏Area事件', name);
  });

  skeleton.onShowArea((name) => {
    console.log('监听显示Area事件', name);
  });

  const activeIndex = ref('1');
  const activeIndex2 = ref('1');
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
  };
</script>

<template>
  <div class="bg-white p-5 m-5" :class="[ns.b()]">
    <etfma-menu :default-active="activeIndex" class="etfma-menu-demo" @select="handleSelect">
      <etfma-menu-item index="1">Processing Center</etfma-menu-item>
      <etfma-sub-menu index="2">
        <template #title>Workspace</template>
        <etfma-menu-item index="2-1">item one</etfma-menu-item>
        <etfma-menu-item index="2-2">item two</etfma-menu-item>
        <etfma-menu-item index="2-3">item three</etfma-menu-item>
        <etfma-sub-menu index="2-4">
          <template #title>item four</template>
          <etfma-menu-item index="2-4-1">item one</etfma-menu-item>
          <etfma-menu-item index="2-4-2">item two</etfma-menu-item>
          <etfma-menu-item index="2-4-3">item three</etfma-menu-item>
        </etfma-sub-menu>
      </etfma-sub-menu>
      <etfma-menu-item index="3" disabled>Info</etfma-menu-item>
      <etfma-menu-item index="4">Orders</etfma-menu-item>
    </etfma-menu>
    <div class="h-6" />
    <etfma-menu
      :default-active="activeIndex2"
      class="etfma-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <etfma-menu-item index="1">Processing Center</etfma-menu-item>
      <etfma-sub-menu index="2">
        <template #title>Workspace</template>
        <etfma-menu-item index="2-1">item one</etfma-menu-item>
        <etfma-menu-item index="2-2">item two</etfma-menu-item>
        <etfma-menu-item index="2-3">item three</etfma-menu-item>
        <etfma-sub-menu index="2-4">
          <template #title>item four</template>
          <etfma-menu-item index="2-4-1">item one</etfma-menu-item>
          <etfma-menu-item index="2-4-2">item two</etfma-menu-item>
          <etfma-menu-item index="2-4-3">item three</etfma-menu-item>
        </etfma-sub-menu>
      </etfma-sub-menu>
      <etfma-menu-item index="3" disabled>Info</etfma-menu-item>
      <etfma-menu-item index="4">Orders</etfma-menu-item>
    </etfma-menu>
    <ElDivider content-position="left">Area操作</ElDivider>
    <div>
      左侧菜单栏：
      <ElSwitch v-model="modelArea.isLeft" @change="(e) => handleArea(e, 'aside')" />
    </div>
    <div>
      顶部显示栏：
      <ElSwitch v-model="modelArea.isHeader" @change="(e) => handleArea(e, 'header')" />
    </div>
    <div>
      底部显示栏：
      <ElSwitch v-model="modelArea.isBottom" @change="(e) => handleArea(e, 'footer')" />
    </div>
    <div>
      Toolbar操作栏：
      <ElSwitch v-model="modelArea.isToolbar" @change="(e) => handleArea(e, 'toolbar')" />
    </div>
    <div>
      Breadcrumb操作栏：
      <ElSwitch v-model="modelArea.isToolbar" @change="(e) => handleArea(e, 'breadcrumb')" />
    </div>
    <div>
      Fixed:
      <ElSwitch v-model="modelArea.isLeftFixed" @change="(e) => handleArea(e, 'fixed')" />
    </div>
    <div>
      Float:
      <ElSwitch v-model="modelArea.isLeftFloat" @change="(e) => handleArea(e, 'float')" />
    </div>
    <ElDivider content-position="left">Widget操作</ElDivider>
    widget显示隐藏：
    <ElSwitch v-model="modelWidget.isLeft" @change="(e) => handleWidget(e, 'leftArea')" />

    <etfma-breadcrumb separator="/">
      <etfma-breadcrumb-item :to="{ path: '/' }">homepage</etfma-breadcrumb-item>
      <etfma-breadcrumb-item><a href="/">promotion management</a></etfma-breadcrumb-item>
      <etfma-breadcrumb-item>promotion list</etfma-breadcrumb-item>
      <etfma-breadcrumb-item>promotion detail</etfma-breadcrumb-item>
    </etfma-breadcrumb>

    <EtfmaTag>Tag 1</EtfmaTag>
    <EtfmaTag class="ml-2" type="success">Tag 2</EtfmaTag>
    <EtfmaTag class="ml-2" type="info">Tag 3</EtfmaTag>
    <EtfmaTag class="ml-2" type="warning">Tag 4</EtfmaTag>
    <EtfmaTag class="ml-2" type="danger">Tag 5</EtfmaTag>

    <EtfmaTag class="mx-1" size="large" effect="plain" round>Large</EtfmaTag>
    <EtfmaTag class="mx-1" effect="light">Default</EtfmaTag>
    <EtfmaTag class="mx-1" size="small" effect="dark">Small</EtfmaTag>

    <EtfmaTooltip placement="top">
      <template #content> multiple lines<br />second line </template>
      Top center
    </EtfmaTooltip>
    <EtfmaTooltip effect="light" content="I am an EtfmaTooltip">
      <span> Some content </span>
    </EtfmaTooltip>

    <EtfmaTooltip content="<span>The content can be <strong>HTML</strong></span>" raw-content>
      <el-button>hover me</el-button>
    </EtfmaTooltip>

    <etfma-dropdown :hide-on-click="false" size="large" trigger="click">
      <span class="etfma-dropdown-link"> Dropdown List </span>
      <template #dropdown>
        <etfma-dropdown-menu>
          <etfma-dropdown-item>Action 1</etfma-dropdown-item>
          <etfma-dropdown-item>Action 2</etfma-dropdown-item>
          <etfma-dropdown-item>Action 3</etfma-dropdown-item>
          <etfma-dropdown-item disabled>Action 4</etfma-dropdown-item>
          <etfma-dropdown-item divided>Action 5</etfma-dropdown-item>
        </etfma-dropdown-menu>
      </template>
    </etfma-dropdown>
    <etfma-dropdown :hide-on-click="false" trigger="click">
      <span class="etfma-dropdown-link"> Dropdown List </span>
      <template #dropdown>
        <etfma-dropdown-menu>
          <etfma-dropdown-item>Action 1</etfma-dropdown-item>
          <etfma-dropdown-item>Action 2</etfma-dropdown-item>
          <etfma-dropdown-item>Action 3</etfma-dropdown-item>
          <etfma-dropdown-item disabled>Action 4</etfma-dropdown-item>
          <etfma-dropdown-item divided>Action 5</etfma-dropdown-item>
        </etfma-dropdown-menu>
      </template>
    </etfma-dropdown>
    <etfma-dropdown :hide-on-click="false" size="small" trigger="click">
      <span class="etfma-dropdown-link"> Dropdown List </span>
      <template #dropdown>
        <etfma-dropdown-menu>
          <etfma-dropdown-item>Action 1</etfma-dropdown-item>
          <etfma-dropdown-item>Action 2</etfma-dropdown-item>
          <etfma-dropdown-item>Action 3</etfma-dropdown-item>
          <etfma-dropdown-item disabled>Action 4</etfma-dropdown-item>
          <etfma-dropdown-item divided>Action 5</etfma-dropdown-item>
        </etfma-dropdown-menu>
      </template>
    </etfma-dropdown>
    <EtfmaDropdown>
      <span class="etfma-dropdown-link"> Dropdown List </span>
      <template #dropdown>
        <EtfmaDropdownMenu>
          <EtfmaDropdownItem>Action 1</EtfmaDropdownItem>
          <EtfmaDropdownItem>Action 2</EtfmaDropdownItem>
          <EtfmaDropdownItem>Action 3</EtfmaDropdownItem>
          <EtfmaDropdownItem disabled>Action 4</EtfmaDropdownItem>
          <EtfmaDropdownItem divided>Action 5</EtfmaDropdownItem>
        </EtfmaDropdownMenu>
      </template>
    </EtfmaDropdown>
  </div>
</template>
<style scoped lang="scss" module>
  @include b('analysis') {
    display: block;
    flex-direction: column;
    align-items: center;
  }
</style>
<style>
  .tooltip-base-box {
    width: 600px;
    margin-left: 300px;
  }
  .tooltip-base-box .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tooltip-base-box .center {
    justify-content: center;
  }
  .tooltip-base-box .box-item {
    width: 110px;
    margin-top: 10px;
  }

  .example-showcase .etfma-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
</style>
