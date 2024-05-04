<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { login } from '@/network/userApi';
  import { isPhoneNumber, notSpace } from '@/js/formValidator';
  import type { FormInstance } from 'element-plus';

  interface LoginForm{
    phone: string
    password: string
  }
  const form = reactive<LoginForm>({
    phone: '',
    password: ''
  })
  const ruleFormRef = ref<FormInstance>()
  const loginRules = {
    phone: [{ validator: isPhoneNumber, trigger: 'blur' }],
    password: [{ validator: notSpace, trigger: 'blur' }]
  }
  function submitForm(formEl?: FormInstance){
    if(!formEl) return
    formEl.validate(valid => {
      if(valid){
        login(form)
      }else{
        return false
      }
    })
  }

</script>

<template>
  <div>
    <el-form :model="form" label-width="auto" style="max-width: 500px" :rules="loginRules" ref="ruleFormRef">
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"/>
      </el-form-item>
    </el-form>
    <div id="login-button-area">
      <el-button @click="submitForm(ruleFormRef)">登录</el-button>
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