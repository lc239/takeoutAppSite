<script setup>
    import { useUserStore } from '@/stores/user';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { getRestaurant } from '@/network/restaurantApi';
    import { register } from '@/network/deliveryApi';

    const { isDeliveryMan } = storeToRefs(useUserStore())
    if(isDeliveryMan.value) getRestaurant()
    const registering = ref(false)
    function handleRegister(){
        registering.value = true
        register()
    }
</script>

<template>
    <el-container class="delivery-manage-view">
        <el-main v-if="!isDeliveryMan" class="not-delivery-man-content">
            <span>您还不是骑手，填写下面信息注册成为骑手吧（不过现在点击就送）</span>
            <el-button @click="handleRegister()" :disabled="registering">成为骑手</el-button>
        </el-main>
        <template v-else>
            <el-aside width="250px">
                <el-menu router id="restaurant-view-aside-menu">
                    <el-menu-item index="/deliveryCenter">
                        个人信息
                    </el-menu-item>
                    <el-menu-item index="/deliveryCenter/order">
                        接取订单
                    </el-menu-item>
                    <el-menu-item index="/deliveryCenter/history">
                        历史订单
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <RouterView/>
            </el-main>
        </template>
    </el-container>
</template>