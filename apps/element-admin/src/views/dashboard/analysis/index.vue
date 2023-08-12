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
    EtfmaBreadcrumb,
    EtfmaBreadcrumbItem,
    EtfmaTag,
  } from '@etfma/ui';

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
</script>

<template>
  <div class="p-5 pt-0" :class="[ns.b()]">
    <div class="p-5" :class="ns.e('body')">
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
  </div>
</template>
<style scoped lang="scss" module>
  @include b('analysis') {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    background-color: getCssVar('fill-color');

    @include e('body') {
      background-color: getCssVar('bg-color');
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
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
