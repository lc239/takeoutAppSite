<script setup>
    import LoadMoreInView from '@/components/LoadMoreInView.vue';
    import UserHistoryItem from '@/components/userCenter/UserHistoryItem.vue';
    import { getOrders } from '@/network/userApi'
    import { ref } from 'vue';

    const orders = ref([])
    const msg = ref('拉到底加载') //页面底部的提示
    const activeOrders = ref([])
    let pageOffset = 0 //该请求的页数偏移
    const pageSize = 10 //一页10个
    function loadMore(){
        getOrders({pageOffset, pageSize}, {
            onSucceed: newOrders => {
                if (newOrders.length < pageSize) {
                    msg.value = '已经没有其他订单了'
                }
                orders.value.push(...newOrders)
                pageOffset++
            },
            onFailed: failMsg => msg.value = failMsg,
            onError: err => msg.value = '发生错误，请检查网络'
        })
    }
</script>

<template>
    <el-scrollbar max-height="480px">
        <template v-if="orders.size === 0">
            {{ msg }}
        </template>
        <el-collapse v-model="activeOrders">
            <UserHistoryItem v-for="order in orders" :key="order.id" :order="order"/>
            <LoadMoreInView @load="loadMore">
               <div class="history-footer" ref="historyFooter">
                    {{ msg }}
                </div> 
            </LoadMoreInView>
        </el-collapse>
    </el-scrollbar>
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