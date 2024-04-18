<script setup lang="ts">
  import { ref } from 'vue'
  import { register } from '@/network/userApi'

  const form = ref({
    username: '',
    phone: '',
    password: ''
  })
</script>

<template>
    <div class="login-panel">
        <el-form :model="form" label-width="auto" style="max-width: 500px">
            <el-form-item label="用户名">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="验证码">
                <el-input/>
            </el-form-item>
            <el-form-item label="密码">
               <el-input v-model="form.password" type="password"/>
            </el-form-item>
        </el-form>
        <div id="register-button-area">
            <el-button @click="() => register(form)">注册</el-button>
        </div>
    </div>
</template>

<style>
  #register-button-area{
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>