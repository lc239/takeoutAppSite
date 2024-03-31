<script setup>
    import MenuCard from '@/components/restaurantPage/MenuCard.vue'
    import { getNotTakenOrder } from '@/network/restaurantApi'
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import { ref } from 'vue'

    const { checkingOrderId } = storeToRefs(useUserStore())
    const order = ref({
        address: {},
        menus: []
    })
    const loading = ref(true)
    function handleOpen(){
        loading.value = true
        getNotTakenOrder(checkingOrderId.value, {
            onSucceed: res => order.value = res,
            onFinally: loading.value = false
        })
    }

</script>

<template>
    <el-dialog class="order-dialog" title="订单详情" v-loading="loading" @open="handleOpen()">
        <el-scrollbar height="400px">
            <div v-for="menu of order.menus" class="menu">
                <MenuCard :menu="menu" />
            </div>
        </el-scrollbar>
        <template #footer>
            <slot name="footer" :price="order.price" :address="order.address" :deliveryPrice="order.deliveryPrice" :packPrice="order.packPrice" :createTime="order.createTime" :completeTime="order.completeTime"></slot>
        </template>
    </el-dialog>
</template>

<style scoped>
.order-dialog .menu{
    height: 82px;
    width: 100%;
}
.menu + .menu{
    margin-top: 10px;
}
</style>