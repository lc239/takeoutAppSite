<script setup lang="ts">
    import { instantToFormat } from '@/js/unit'
    import type { Order } from '@/type/class';

    const props = defineProps<{
        order: Order
    }>()
</script>

<template>
    <el-card class="delivery-order-card">
        <div class="flex-space-between">
            <span>{{ '姓名：' + props.order.address.name }}</span>
            <span>{{ '电话：' + props.order.address.phone }}</span>
            <span>{{ '下单时间：' + instantToFormat(props.order.createTime!) }}</span>
        </div>
        <div>{{ '地址：' + props.order.address.address }}</div>
    </el-card>
</template>

<style>
/* .delivery-order-card{
    width: 100%;
} */
</style>