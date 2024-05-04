<script setup lang="ts">
    import type { Order } from '@/type/class'
    import type { CSSProperties } from 'vue'
    import { useRestaurantStore } from '@/stores/restaurant'
    import { instantToFormat } from '@/js/unit'

    const props = defineProps<{
        order: Order
    }>()

    const { showOrderDialog } = useRestaurantStore()

    const bodyStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
    function handleClickCard(){
        showOrderDialog(props.order.orderId)
    }
</script>

<template>
    <el-card class="message-card" :body-style="bodyStyle" shadow="hover" @click="handleClickCard()">
        <span>{{ instantToFormat(props.order.createTime!) }} 订单</span>
    </el-card>
</template>