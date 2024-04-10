<script setup>
    import { getRestaurantById } from '@/network/restaurantApi'
    import { ref, onBeforeMount, computed } from 'vue'
    import { aliUrlPrefix } from '@/js/aliOssConfig'
    import { fenToYuan, instantToFormat } from '@/js/unit'
    import { useUserStore } from '@/stores/user'

    const { showCommentDialog } = useUserStore()
    const props = defineProps(['order'])
    const orderCreateTime = computed(() => {
        return instantToFormat(props.order.createTime)
    })
    const orderCompleteTime = computed(() => {
        return props.order.completeTime ? instantToFormat(props.order.completeTime) : '未完成'
    })
    const restaurantName = ref('')
    const restaurantImgFilename = ref('')
    onBeforeMount(() => {
        getRestaurantById(props.order.restaurantId,{
            onSucceed: restaurant =>{
                restaurantName.value = restaurant.name
                restaurantImgFilename.value = restaurant.imageFilename
            },
            onFailed: msg => restaurantName.value = '店铺不存在'
        })
    })
</script>

<template>
    <el-collapse-item class="user-history-item">
        <template #title>
            <div class="user-history-item-title">
                <span>{{ `店铺名：${restaurantName}` }}</span>
                <div class="title-right">
                    <span>{{ `总价：${fenToYuan(props.order.price) + '元'}` }}</span>
                    <span>{{ `下单时间：${orderCreateTime}` }}</span>
                </div>
            </div>
        </template>
        <template #default>
            <div class="item-content">
                <div class="item-header">
                    {{ `订单号: ${props.order.orderId}` }}
                </div>
                <div class="item-main">
                    <el-image :src="aliUrlPrefix + restaurantImgFilename"
                        style="width: 100px; height: 100px; vertical-align: text-bottom;">
                    </el-image>
                    <span>{{ restaurantName }}</span>
                    <div class="menu" v-for="menu in props.order.menus">
                        <div class="menu-name">{{ menu.name }}</div>
                        <div class="menu-num">{{ `${menu.num}份` }}</div>
                        <div class="menu-price">{{ `总价：${fenToYuan(menu.price)}元` }}</div>
                    </div>
                </div>
                <div class="item-footer">
                    <span>{{ `下单时间：${orderCreateTime}` }}</span>
                    <span>{{ `完成时间: ${orderCompleteTime}` }}</span>
                </div>
            </div>
            <div class="item-op">
                <el-button v-if="!props.order.commentId" @click="showCommentDialog(props.order)">评价</el-button>
            </div>
        </template>
    </el-collapse-item>
</template>

<style>
.item-content{
    padding: 0 10px;
}
.user-history-item-title{
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    width: 100%;
}
.user-history-item-title > .title-right{
    display: flex;
    justify-content: space-between;
    flex-basis: 300px;
}
.item-content > .item-header{
    height: 30px;
    width: 100%;
}
.item-content > .item-footer{
    display: flex;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    padding: 10px;
}
.item-main > .menu{
    padding: 10px;
    display: flex;
    justify-content: space-between;
}
.item-main > .menu > .menu-name{
    flex-basis: 220px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.item-main > .menu > .menu-price{
    flex-basis: 110px;
}
.user-history-item .item-op{
    display: flex;
    justify-content: center;
    column-gap: 6px;
}
</style>