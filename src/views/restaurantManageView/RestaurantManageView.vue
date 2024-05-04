<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { ref, inject } from 'vue';
    import { getNotTakenOrder, register } from '@/network/restaurantApi';
    import { useRestaurantStore } from '@/stores/restaurant';
    import { useRouter } from 'vue-router';
    import OrderDialog from '@/components/restaurantCenter/OrderDialog.vue'
    import { fenToYuan, instantToFormat } from '@/js/unit'
    import { useUserStore } from '@/stores/user';
    import { takeOrder, rejectOrder } from '@/network/restaurantApi'
    import { ElMessage } from 'element-plus'
    import type { Order } from '@/type/class';

    const { restaurant, orderDialogVisible } = storeToRefs(useRestaurantStore())
    const { closeOrderDialog, takeOrder: takeOrderByStore } = useRestaurantStore()
    const registerForm = ref({name: '', introduction: ''})
    const headerHeightPx = inject<number>("headerHeightPx")
    const router = useRouter()
    const { removeCheckingMsg } = useUserStore()

    function handleTakeOrder(order: Order){
        takeOrder(order.orderId!, {
            onSucceed: () => {
                ElMessage({
                    type: 'success',
                    message: '接单成功'
                })
                takeOrderByStore(order)
            },
            onFinally: () => {
                removeCheckingMsg()
                closeOrderDialog()
            }
        })
    }
    function handleRejectOrder(order: Order){
        rejectOrder(order.orderId!)
        removeCheckingMsg()
        closeOrderDialog()
    }

    const order = ref<Order | null>(null)
    const orderTaken = ref(false)
    const { checkingOrderId } = storeToRefs(useRestaurantStore())
    const { findOrderById } = useRestaurantStore()
    function handleOpen(){
        const foundOrder = findOrderById(checkingOrderId.value!)
        if(foundOrder){
            order.value = foundOrder
            orderTaken.value = true
        }else{
            orderTaken.value = false
            getNotTakenOrder(checkingOrderId.value!, {
                onSucceed: res => order.value = res,
            })
        }
    }
    function handleClose(){
        checkingOrderId.value = undefined
        order.value = null
    }
</script>

<template>
    <el-container class="restaurant-manage-view">
        <el-main v-if="!restaurant" class="not-seller-content">
            <span class="tip">填写下面信息注册店铺吧</span>
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
                        @click="() => register(registerForm, {onSucceed: () => router.push({name: 'RestaurantInformation'})})">注册店铺</el-button>
                </el-form-item>
            </el-form>
        </el-main>
        <template v-else>
            <el-aside width="250px">
                <el-menu router id="restaurant-view-aside-menu" default-active="/restaurantCenter">
                    <el-menu-item index="/restaurantCenter">
                        店铺信息
                    </el-menu-item>
                    <el-menu-item index="/restaurantCenter/menuManagement">
                        菜品管理
                    </el-menu-item>
                    <el-menu-item index="/restaurantCenter/orderManagement">
                        订单处理
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main :style="{height: `calc(100vh - ${headerHeightPx! + 16 + 40}px)`}">
                <el-scrollbar height="100%">
                    <RouterView />
                </el-scrollbar>
            </el-main>
        </template>
    </el-container>
    <OrderDialog v-model="orderDialogVisible" v-loading="order ? false : true" :order="order" @open="handleOpen()" @close="handleClose()">
        <template #footer>
            <div class="order-dialog-footer">
                <div class="order-summary">
                    <div class="flex-space-between">
                        <span>{{ '打包费：' + order?.packPrice }}</span>
                        <span>{{ '配送费：' + order?.deliveryPrice }}</span>
                        <span>{{ '总价：' + fenToYuan(order?.price) + '元' }}</span>
                    </div>
                    <div class="flex-space-between">
                        <span>{{ '客户名：' + order?.address.name }}</span>
                        <span>{{ '电话：' + order?.address.phone }}</span>
                        <span>{{ '地址：' + order?.address.address }}</span>
                    </div>
                    <div class="flex-space-between" style="--flex-item-count: 2">
                        <span>{{ '下单时间：' + instantToFormat(order?.createTime!) }}</span>
                        <span>{{ '完成时间：' + instantToFormat(order?.completeTime!) }}</span>
                    </div>
                </div>
                <div class="order-op" v-show="!orderTaken">
                    <el-button @click="handleTakeOrder(order!)">接单</el-button>
                    <el-button type="danger" @click="handleRejectOrder(order!)">拒绝</el-button>
                </div>
            </div>
        </template>
    </OrderDialog>
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