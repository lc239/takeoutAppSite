<script setup>
    import TopNav from '@/components/homePage/TopNav.vue'
    import { onBeforeMount } from 'vue'
    import { getInfo } from '@/network/userApi'
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import MessageCard from '@/components/homePage/MessageCard.vue'
    import OrderDialog from '@/components/restaurantCenter/OrderDialog.vue'
    import { takeOrder, rejectOrder } from '@/network/restaurantApi'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { instantToFormat } from '@/js/unit'

    const { openWs, checkMsgs, removeMsgAt, showOrderDialog, closeOrderDialog, setOrderId, setCheckingMsgIndex, removeCheckingMsg } = useUserStore()
    const { msgDrawer, msgs, checkingOrderId, orderDialogVisible, checkingMsgIndex } = storeToRefs(useUserStore())

    onBeforeMount(() => {
        //进入首页获取信息
        getInfo({
            onSucceed: () => openWs() //进入页面没问题就建立websocket连接
        })
    })

    function handleClickMsg(msg, index){
        setCheckingMsgIndex(index)
        switch (msg.type) {
            case 0:
                setOrderId(msg.data)
                showOrderDialog()
                break;
        
            default:
                break;
        }
    }
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
    function handleDeleteMsg(msg, index){
        switch (msg.type) {
            case 0:
                ElMessageBox.confirm('拒绝此订单？').then(() => {
                    rejectOrder(msg.data)
                    removeMsgAt(index)
                })
                break;
        
            default:
                break;
        }
    }
</script>

<template>
    <el-container>
        <el-header height="40" class="top-nav">
            <TopNav/>
        </el-header>
        <el-main>
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
                    <MessageCard v-for="(msg, index) of msgs" :msg="msg" @delete="handleDeleteMsg(msg, index)" @click="handleClickMsg(msg, index)"/>
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
.top-nav {
    padding: 6px 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px rgb(180, 170, 170);
}
.order-dialog-footer{
    font-size: 14px;
}
.order-dialog-footer > .order-op{
    margin-top: 6px;
    text-align: end;
}
</style>
