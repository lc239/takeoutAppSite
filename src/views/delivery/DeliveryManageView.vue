<script setup lang="ts">
    import OrderDialog from '@/components/deliveryPage/OrderDialog.vue';
import { useDeliveryStore } from '@/stores/delivery';
import { storeToRefs } from 'pinia';

    // const { user } = storeToRefs(useUserStore())
    // const registering = ref(false)
    // function handleRegister(){
    //     registering.value = true
    //     register()
    // }
    // onBeforeMount(() => {
    //     if(user.value!.isDeliveryMan) getInfo()
    // })
    const { order, orderDialogVisible } = storeToRefs(useDeliveryStore())
</script>

<template>
    <el-container class="delivery-manage-view">
        <!-- <el-main v-if="!user!.isDeliveryMan" class="not-delivery-man-content">
            <el-button @click="handleRegister()" :disabled="registering">成为骑手</el-button>
        </el-main> -->
            <el-aside width="250px">
                <el-menu router id="restaurant-view-aside-menu" default-active="/deliveryCenter">
                    <el-menu-item index="/deliveryCenter">
                        个人信息
                    </el-menu-item>
                    <el-menu-item index="/deliveryCenter/order">
                        接取订单
                    </el-menu-item>
                    <!-- <el-menu-item index="/deliveryCenter/history">
                        历史订单
                    </el-menu-item> -->
                </el-menu>
            </el-aside>
            <el-main>
                <RouterView v-slot="{ Component }">
                    <KeepAlive include="DeliveryInformationView">
                        <component :is="Component"></component>
                    </KeepAlive>
                </RouterView>
            </el-main>
    </el-container>
    <OrderDialog :order="order" v-model="orderDialogVisible"/>
</template>