<script setup>
    import { useUserStore } from '@/stores/user'
    import { Search } from '@element-plus/icons-vue'
    import { storeToRefs } from 'pinia'
    import { ref } from 'vue'

    const { avatarUrl, isLogin } = storeToRefs(useUserStore())
    const searchContent = ref('')
</script>

<template>
    <!-- 用el-menu改一下 -->
    <div class="top-nav-left">
        <RouterLink to="/" id="nav-to-home">首页</RouterLink>
        <el-button>下载安卓app</el-button>
    </div>
    <el-input v-if="isLogin" v-model="searchContent" placeholder="输入店名搜索" size="large" class="search-input">
        <template #append>
            <el-button :icon="Search" />
        </template>
    </el-input>
    <div class="top-nav-right">
        <div class="nav-main">
            <el-avatar v-if="isLogin"  class="avatar" :src="avatarUrl" />
            <el-button v-else class="to-login" circle type="primary">登录</el-button>
            <div class="nav-main-right">
                <div class="to-center">
                    <RouterLink to="/userCenter">个人中心</RouterLink>
                    <RouterLink to="/restaurantCenter">店铺管理</RouterLink>
                    <RouterLink to="/deliveryCenter">骑手中心</RouterLink>
                </div>
            </div>
        </div>
        <div class="nav-extra">
            <!-- 把这里的新消息绑定 -->
            <el-badge :value="1">
                <el-icon :size="30">
                    <Message />
                </el-icon>
            </el-badge>
        </div>
    </div>
</template>

<style>
#nav-to-home{
    margin: 0 16px 0 8px;
}

.top-nav-right {
    display: flex;
}

.search-input {
    max-width: 600px;
    flex-grow: 0;
    padding: 0 20px;
}

.top-nav-right .nav-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    --avatar-size: 40px;
    --avatar-right-margin: 10px;
}

.top-nav-right .nav-main .to-login{
    width: var(--avatar-size);
    height: var(--avatar-size);
    margin-right: var(--avatar-right-margin);
}

.top-nav-right .nav-main .avatar {
    margin-right: var(--avatar-right-margin);
    cursor: pointer;
}

.top-nav-right .nav-main .nav-main-right .to-center {
    display: flex;
    column-gap: 8px;
}

.top-nav-right .nav-extra {
    margin-left: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-main-right {
    width: max-content;
}
</style>