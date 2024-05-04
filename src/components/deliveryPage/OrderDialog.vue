<script setup lang="ts">
    import type { Order } from '@/type/class';

    const props = defineProps<{
        order: Order | null
    }>()
</script>

<template>
    <el-dialog class="order-dialog" title="订单详情" v-loading="$props.order ? false : true">
        <el-scrollbar height="400px">
            <div v-for="menu of $props.order?.menus" class="delivery-menu">
                <span>菜品名称：{{ menu.name }}</span>
                <span>{{ menu.num }}份</span>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<style>
.delivery-menu{
    padding: 10px;
    display: flex;
    justify-content: space-between;
}
</style>