<script setup>
    import { useUserStore } from '@/stores/user';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { getRestaurant, register } from '@/network/restaurantApi';
    import { ElMessage } from 'element-plus';

    const { isSeller } = storeToRefs(useUserStore())
    if(isSeller.value) getRestaurant()
    const registerForm = ref({name: '', introduction: ''})
</script>

<template>
    <el-container class="restaurant-manage-view">
        <el-main v-if="!isSeller" class="not-seller-content">
            <span class="tip">您还不是商家，填写下面信息注册成为商家吧</span>
            <el-form v-model="registerForm" style="width: 500px;">
                <el-form-item label="店铺名称">
                    <el-input v-model="registerForm.name" max-length="15" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="店铺简介">
                    <el-input v-model="registerForm.introduction" type="textarea" max-length="200" show-word-limit
                        autosize></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="register-button"
                        @click="() => register(registerForm)">注册店铺</el-button>
                </el-form-item>
            </el-form>
        </el-main>
        <template v-else>
            <el-aside width="250px">
                <el-menu router id="restaurant-view-aside-menu">
                    <el-menu-item index="/restaurantCenter">
                        店铺信息
                    </el-menu-item>
                    <el-menu-item index="/restaurantCenter/menuManagement">
                        菜品管理
                    </el-menu-item>
                    <el-menu-item index="/restaurantCenter">
                        订单处理
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <RouterView/>
            </el-main>
        </template>
    </el-container>
</template>

<style>
.restaurant-manage-view > .not-seller-content{
    width: 100%;
    display: flex;
    row-gap: 30px;
    flex-direction: column;
    align-items: center;
}
.not-seller-content .register-button{
    margin: auto;
}
#restaurant-view-aside-menu{
    /* 视口高度减去header减去aside的padding减去body的margin */
    min-height: calc(100vh - 53px - 40px - 16px);
}
</style>