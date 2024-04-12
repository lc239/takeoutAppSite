<script setup lang="ts">
    import { ref, onBeforeMount, watch } from 'vue'
    import { instantToFormat, secondsToFormat1 } from '@/js/unit'
    import { getRestaurantById } from '@/network/restaurantApi'
    import dayjs from 'dayjs'
    import type { Order } from '@/type/class';

    const props = defineProps<{
        order: Order
    }>()
    const restaurantName = ref('') //可以在后端加个字段, 不使用loading，减少和服务器交互次数
    const loading = ref(true)

    const status = ref('')

    let timer: number
    const excessSeconds = ref(dayjs(props.order.createTime).add(10, 'm').diff(dayjs(), 's'))
    //状态在后端该设置运送中字段，但运送过程没有做，先不管
    watch(() => props.order.taken, taken => {
        clearInterval(timer)
        if(!taken){
            status.value = `(待商家接单${secondsToFormat1(excessSeconds.value)})`
            timer = setInterval(() => {
                if(excessSeconds.value === 0) clearInterval(timer)
                excessSeconds.value--
                status.value = `(待商家接单${secondsToFormat1(excessSeconds.value)})`
            }, 1000)
        }else{
            status.value = '商家已接单'
        }
    }, {immediate: true})

    onBeforeMount(() => {
        getRestaurantById(props.order.restaurantId!,{
            onSucceed: restaurant =>{
                restaurantName.value = restaurant.name
            },
            onFinally: () => loading.value = false
        })
    })
</script>

<template>
    <el-card class="user-delivering-order" shadow="hover" v-loading="loading">
        <div>店铺名：{{ restaurantName }}</div>
        <div class="address">
            <span>取餐信息：{{ $props.order.address.name + ',' + $props.order.address.phone + ',' + $props.order.address.address }}</span>
        </div>
        <div class="status">
            <span>下单时间: {{ instantToFormat($props.order.createTime!) }}</span>
            <span>状态：{{ status }}</span>
        </div>
    </el-card>
</template>

<style>
.user-delivering-order{
    cursor: pointer;
}
.user-delivering-order .address{
    word-break: break-all;
}
.user-delivering-order .status{
    display: flex;
    justify-content: space-between;
}
.user-delivering-order + .user-delivering-order{
    margin-top: 6px;
}
</style>