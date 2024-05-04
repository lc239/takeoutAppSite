<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import OrderCard from '@/components/restaurantCenter/OrderCard.vue'
    import { useRestaurantStore } from '@/stores/restaurant';

    const { takenOrders } = storeToRefs(useRestaurantStore())
</script>

<template>
    <div class="order-manage-view">
        <span v-show="!takenOrders.length">还没有订单</span>
        <OrderCard v-for="order of takenOrders" :order="order"/>
    </div>
</template>

<style>
    .order-manage-view{
        display: flex;
        flex-direction: column;
        row-gap: 8px;
    }
</style>