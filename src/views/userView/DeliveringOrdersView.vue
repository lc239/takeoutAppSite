<script setup>
    import { useHistoryStore } from '@/stores/history'
    import { storeToRefs } from 'pinia'
    import { getDeliveringOrders } from '@/network/userApi'
    import DeliveringOrderItem from '@/components/userCenter/DeliveringOrderItem.vue'
    import { ref } from 'vue'

    const { deliveringOrders } = storeToRefs(useHistoryStore())
    const loading = ref(true)
    getDeliveringOrders({
        onFinally: () => loading.value = false
    })
</script>

<template>
    <div class="delivering-order-wrapper" v-loading="loading">
        <div v-show="!deliveringOrders.length">没有订单</div>
        <DeliveringOrderItem v-for="order of deliveringOrders" :order="order" />
    </div>
</template>

<style>
.delivering-order-wrapper{
    background-color: white;
    border-radius: 4px;
    padding: 8px;
}
</style>