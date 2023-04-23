<template>
  <ElForm ref="formRef" class="enter-x" :model="formModel" :rules="formRules">
    <ElFormItem prop="username" class="enter-x">
      <ElInput v-model:value="formModel.username" size="large" placeholder="用户名" />
    </ElFormItem>
    <ElFormItem prop="username" class="enter-x">
      <ElInput v-model:value="formModel.password" size="large" placeholder="密码" type="password" />
    </ElFormItem>
    <div class="enter-x flex">
      <ElFormItem prop="rememberMe" class="flex-1">
        <ElCheckbox v-model:checked="formModel.rememberMe">记住我</ElCheckbox>
      </ElFormItem>
      <ElFormItem class="flex-1 text-right">
        <ElButton link type="primary">忘记密码</ElButton>
      </ElFormItem>
    </div>
    <ElFormItem class="enter-x">
      <ElButton type="primary" size="large" :loading="isLoading" @click="handleLogin">
        登录
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
  import { useAsyncState } from '@etfm/vea-hooks';
  import {
    ElButton,
    ElCheckbox,
    ElForm,
    ElFormItem,
    ElInput,
    type FormInstance,
    type FormRules,
  } from 'element-plus';
  import { reactive, ref, unref } from 'vue';

  defineOptions({
    name: 'LoginForm',
  });

  interface LoginFormState {
    // 用户名
    username: string;
    // 密码
    password: string;
    // 记住我
    rememberMe?: boolean;
  }

  interface Props {
    /**
     * @description 登录函数
     */
    loginFunc: (form: LoginFormState) => Promise<void>;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const formRef = ref<FormInstance>();

  const formModel = reactive<LoginFormState>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const formRules = reactive<FormRules>({
    username: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  });

  const { isLoading, execute } = useAsyncState(
    async () => {
      await props?.loginFunc?.(formModel);
    },
    null,
    { immediate: false },
  );

  async function handleLogin(e: MouseEvent) {
    if (!unref(formRef)) return;
    e?.preventDefault();

    const values = await unref(formRef)?.validate();

    console.log(values, '-----------');

    if (!values) {
      return;
    }
    await execute();
  }
</script>
