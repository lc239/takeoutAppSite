<script setup lang="ts">
    import LoadMoreInView from '@/components/LoadMoreInView.vue'
    import CompletedOrderItem from '@/components/userCenter/CompletedOrderItem.vue'
    import CommentDialog from '@/components/userCenter/CommentDialog.vue'
    import { getOrders } from '@/network/userApi'
    import { ref } from 'vue'
    import type { Order } from '@/type/class'

    const orders = ref<Order[]>([])
    let pageOffset = 0 //该请求的页数偏移
    const pageSize = 10 //一页10个
    const loadView = ref<InstanceType<typeof LoadMoreInView> | null>(null)
    function loadMore(){
        getOrders({pageOffset, pageSize}, {
            onSucceed: newOrders => {
                if (newOrders.length < pageSize) {
                    loadView.value!.unobserve()
                }else{
                    loadView.value!.waitNext()
                }
                orders.value.push(...newOrders)
                pageOffset++
            }
        })
    }
</script>

<template>
    <el-scrollbar max-height="480px">
        <el-collapse>
            <CompletedOrderItem v-for="order in orders" :key="order.orderId" :order="order"/>
            <LoadMoreInView @load="loadMore" ref="loadView" v-slot="slotProps">
               <div class="history-footer">
                    <template v-if="slotProps.observing">
                        拉到底就会刷新哦
                    </template>
                    <template v-else>
                        已经没有其他订单了
                    </template>
                </div>
            </LoadMoreInView>
        </el-collapse>
    </el-scrollbar>
    <CommentDialog/>
</template>

<style>
.history-footer{
    height: 50px;
    padding: 10px;
    line-height: 30px;
    width: 100%;
    text-align: center;
    font-size: 13px;
    background-color: white;
}
</style>