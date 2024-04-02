<script setup>
    import TopNav from '@/components/homePage/TopNav.vue'
    import { onBeforeMount, provide } from 'vue'
    import { getInfo } from '@/network/userApi'
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import MessageCard from '@/components/homePage/MessageCard.vue'
    import OrderDialog from '@/components/restaurantCenter/OrderDialog.vue'
    import { takeOrder, rejectOrder } from '@/network/restaurantApi'
    import { ElMessage } from 'element-plus'
    import { instantToFormat } from '@/js/unit'

    const { openWs, checkMsgs, closeOrderDialog, removeCheckingMsg } = useUserStore()
    const { msgDrawer, msgs, checkingOrderId, orderDialogVisible } = storeToRefs(useUserStore())

    function handleTakeOrder(){
        ElMessage('正在接单，请稍等')
        takeOrder(checkingOrderId.value, {
            onSucceed: () => ElMessage({
                type: 'success',
                message: '接单成功'
            }),
            onFinally: () => {
                removeCheckingMsg()
                closeOrderDialog()
            }
        })
    }
    function handleRejectOrder(){
        rejectOrder(checkingOrderId.value)
        removeCheckingMsg()
        closeOrderDialog()
    }
    
    onBeforeMount(() => {
        //进入首页获取信息
        getInfo({
            onSucceed: () => openWs() //进入页面没问题就建立websocket连接
        })
    })
    provide("headerHeightPx", 50)
</script>

<template>
    <el-container>
        <el-header height="50px" id="top-nav">
            <TopNav/>
        </el-header>
        <!-- body在edge有8px的margin，等多浏览器再处理 -->
        <el-main style="padding-top: calc(42px + var(--el-main-padding));">
            <RouterView v-slot="{ Component }">
                <KeepAlive include="HomeView">
                    <component :is="Component"></component>
                </KeepAlive>
            </RouterView>
            <el-drawer v-model="msgDrawer" @open="checkMsgs()">
                <template #header>
                    <h3>消息</h3>
                </template>
                <template #default>
                    <p v-show="msgs.length === 0">还没有消息哦</p>
                    <MessageCard v-for="msg of msgs" :msg="msg" />
                </template>
            </el-drawer>
            <OrderDialog v-model="orderDialogVisible">
                <template #footer="slotProps">
                    <div class="order-dialog-footer">
                        <div class="order-summary">
                            <div class="flex-space-between">
                                <span>{{ '打包费：' + slotProps.packPrice }}</span>
                                <span>{{ '配送费：' + slotProps.deliveryPrice }}</span>
                                <span>{{ '总价：' + slotProps.price }}</span> 
                            </div>
                            <div class="flex-space-between">
                                <span>{{ '客户名：' + slotProps.address.name }}</span>
                                <span>{{ '电话：' + slotProps.address.phone }}</span>
                                <span>{{ '地址：' + slotProps.address.address }}</span>
                            </div>
                            <div class="flex-space-between" style="--flex-item-count: 2">
                                <span>{{ '下单时间：' + instantToFormat(slotProps.createTime) }}</span>
                                <span>{{ '完成时间：' + instantToFormat(slotProps.completeTime) }}</span>
                            </div>
                        </div>
                        <div class="order-op">
                            <el-button @click="handleTakeOrder()">接单</el-button>
                            <el-button type="danger" @click="handleRejectOrder()">拒绝</el-button>
                        </div>
                    </div>
                </template>
            </OrderDialog>
        </el-main>
    </el-container>
</template>

<style>
#top-nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px rgb(180, 170, 170);
    background-color: white;
    position: fixed;
    top: 0;
    z-index: 1000;
}
.order-dialog-footer{
    font-size: 14px;
}
.order-dialog-footer > .order-op{
    margin-top: 6px;
    text-align: end;
}
</style>
