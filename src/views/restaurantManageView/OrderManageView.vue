<script setup lang="ts">
    import MessageCard from '@/components/homePage/MessageCard.vue'
    import { useUserStore } from '@/stores/user';
    import { storeToRefs } from 'pinia';

    const { orderMsgs } = storeToRefs(useUserStore())
</script>

<template>
    <div class="order-manage-view">
        <span v-show="!orderMsgs.length">还没有订单</span>
        <MessageCard v-for="msg of orderMsgs" :msg="msg"/>
    </div>
</template>

<style>
    .order-manage-view{
        display: flex;
        flex-direction: column;
        row-gap: 8px;
    }
</style>