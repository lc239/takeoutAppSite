<script setup lang="ts">
  import LoginPanel from "@/components/loginPage/LoginPanel.vue";
  import RegisterPanel from "@/components/loginPage/RegisterPanel.vue";
  import { useUserStore } from "@/stores/user";
  import { ElMessage } from "element-plus";
  import { storeToRefs } from "pinia";
  import { ref } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  const login = ref(true)
  const { isLogin } = storeToRefs(useUserStore())

  onBeforeRouteLeave((to, from) => {
    if(isLogin) return true
    ElMessage({
      message: '请先登录',
      type: 'info'
    })
    return false
  })
</script>

<template>
  <div id="login-view">
    <div id="panel">
      <div id="tab-bar">
        <div :class="['login-tab', 'button-text', {active: login}]" @click="() => login = true">登录</div>
        <div class="divider"></div>
        <div :class="['register-tab', 'button-text', {active: !login}]" @click="() => login = false">注册</div>
      </div>
      <component :is="login ? LoginPanel : RegisterPanel"></component>
    </div>
  </div>
</template>

<style>
  #login-view{
    padding-top: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #panel{
    border: 1px solid var(--blue1);
    border-radius: 6px;
    padding: 0 20px 10px;
  }
  #tab-bar{
    padding: 18px 0 ;
    display: flex;
    justify-content: center;
  }
  #tab-bar .divider{
    border-left: 1px solid #000;
  }
  #tab-bar .button-text{
    flex: 1;
    display: flex;
    justify-content: center;
    cursor: pointer;
    --button-text-font-size: 16px;
  }
</style>