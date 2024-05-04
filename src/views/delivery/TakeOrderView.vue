<script setup lang="ts">
    import '@/assets/deliveryPage/common.css'
//设置刷新方法刷新本路由
    import OrderCard from '@/components/deliveryPage/OrderCard.vue'
    import LoadMoreInView from '@/components/LoadMoreInView.vue'
    import { getOrders, takeOrder } from '@/network/deliveryApi'
    import { useDeliveryStore } from '@/stores/delivery'
    import type { Order } from '@/type/class'
    import { ElMessage } from 'element-plus'
    import { ref } from 'vue'

    const { pushOrder, showOrderDialog } = useDeliveryStore()
    const orders = ref<Order[]>([])
    const loadView = ref<InstanceType<typeof LoadMoreInView> | null>(null)
    let indexStart = 0
    const pageSize = 20
    function loadPages(){
        getOrders(indexStart, indexStart + pageSize,{
            onSucceed: res => {
                orders.value.push(...res)
                indexStart += pageSize
                if(res.length < pageSize) loadView.value!.unobserve()
            },
            onFinally: () => loadView.value!.waitNext()
        })
    }
    const waitingTakeOrder = ref(false)
    function handleTakeOrder(orderId: string){
        waitingTakeOrder.value = true
        takeOrder(orderId, {
            onSucceed: order => {
                pushOrder(order)
                ElMessage({
                    type: 'success',
                    message: '接单成功'
                })
            },
            onFinally: () => {
                orders.value.splice(orders.value.findIndex(order => order.orderId === orderId), 1)
                waitingTakeOrder.value = false
            }
        })
    }
</script>

<template>
    <div class="order-wrapper" v-for="order of orders" :key="order.orderId">
        <OrderCard class="order-preview" :order="order" @click="showOrderDialog(order)"/>
        <el-button :disabled="waitingTakeOrder" type="primary" size="large" @click="handleTakeOrder(order.orderId!)">接单</el-button>
    </div>
    <LoadMoreInView id="delivery-take-order-load" ref="loadView" margin-top="10px" @load="() => loadPages()" v-slot="slotProps">
        <template v-if="slotProps.observing">
            拉到底就会刷新哦
        </template>
        <template v-else>
            已经没有其他订单了，刷新页面试试吧
        </template>
    </LoadMoreInView>
</template>