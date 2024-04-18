<script setup lang="ts">
  import { ref } from 'vue'
  import { login } from '@/network/userApi';
  import { useRouter } from 'vue-router';

  const router = useRouter()

  const form = ref({
    phone: '',
    password: ''
  })
</script>

<template>
  <div>
    <el-form :model="form" label-width="auto" style="max-width: 500px">
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"/>
      </el-form-item>
    </el-form>
    <div id="login-button-area">
      <el-button @click="() => login(form, { onSucceed: () => router.push({name: 'Home'}) })">登录</el-button>
      <span class="button-text">忘记密码？点击我使用验证码登录</span>
    </div>
  </div>
</template>

<style>
  #login-button-area{
    flex-direction: column;
    width: 100%;
    display: flex;
    align-items: center;
  }
  #login-button-area .button-text{
    padding: 6px;
  }
</style>