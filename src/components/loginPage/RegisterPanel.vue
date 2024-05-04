<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { RegisterRequest, register, type RegisterForm } from '@/network/userApi'
  import type { FormInstance } from 'element-plus';
  import { isPhoneNumber, notSpace } from '@/js/formValidator';

  const form = reactive<RegisterForm>({
    username: '',
    phone: '',
    password: '',
    role: 0
  })
  const ruleFormRef = ref<FormInstance>()
  const registerRules = {
    username: [{ validator: notSpace, trigger: 'blur' }],
    phone: [{ validator: isPhoneNumber, trigger: 'blur' }],
    password: [{ validator: notSpace, trigger: 'blur' }]
  }
  function submitForm(formEl?: FormInstance){
    if(!formEl) return
    formEl.validate(valid => {
      if(valid){
        register(new RegisterRequest(form))
      }else{
        return false
      }
    })
  }
</script>

<template>
    <div class="login-panel">
        <el-form :model="form" label-width="auto" style="max-width: 500px" :rules="registerRules" ref="ruleFormRef">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" />
            </el-form-item>
            <!-- <el-form-item label="验证码">
                <el-input/>
            </el-form-item> -->
            <el-form-item label="密码" prop="password">
               <el-input v-model="form.password" type="password"/>
            </el-form-item>
            <el-form-item class="center-form-item">
              <el-radio-group v-model="form.role">
                <el-radio :value="0">用户</el-radio>
                <el-radio :value="1">商家</el-radio>
                <el-radio :value="2">骑手</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-form>
        <div id="register-button-area">
            <el-button @click="submitForm(ruleFormRef)">注册</el-button>
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