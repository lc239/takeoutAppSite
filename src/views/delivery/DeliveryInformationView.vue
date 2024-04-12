<script setup lang="ts">
    import '@/assets/deliveryPage/common.css'

    import { useDeliveryStore } from '@/stores/delivery'
    import { storeToRefs } from 'pinia'
    import OrderCard from '@/components/deliveryPage/OrderCard.vue'
    import { completeOrder } from '@/network/deliveryApi'
    import { ElMessageBox, ElMessage } from 'element-plus';
    import { onBeforeMount } from 'vue'
    import { getDeliveringOrders } from '@/network/deliveryApi'

    const { deliveringCount, completeCount, deliveringOrders } = storeToRefs(useDeliveryStore())
    function handleComplete(orderId: string){
        ElMessageBox.confirm(
            '确定完成订单？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(() => {
            ElMessage('提交中，请稍等...')
            completeOrder(orderId, {
                onSucceed: () => {
                    ElMessage({
                        type: 'success',
                        message: '确认成功'
                    })
                }
            })
        })
    }
    onBeforeMount(() => {
        getDeliveringOrders()
    })
</script>

<template>
    <el-descriptions title="个人信息" border :column="2" >
        <el-descriptions-item label="待送餐数">
            {{ deliveringCount }}
        </el-descriptions-item>
        <el-descriptions-item label="完成单数">
            {{ completeCount }}
        </el-descriptions-item>
    </el-descriptions>
    <h3>待送餐</h3>
    <p v-show="deliveringCount === 0">还没有接单哦</p>
    <div v-for="order of deliveringOrders" class="order-wrapper">
        <OrderCard :order="order" class="order-preview" />
        <el-button type="primary" @click="handleComplete(order.orderId!)">确认完成</el-button>
    </div>
</template>