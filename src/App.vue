<script setup lang="ts">
    import TopNav from '@/components/homePage/TopNav.vue'
    import { onBeforeMount, provide, ref } from 'vue'
    import { getInfo } from '@/network/userApi'
    import { getDeliveringOrders, getInfo as getDeliveryInfo } from '@/network/deliveryApi'
    import { getDeliveringOrders as getUsersDeliveringOrders } from '@/network/userApi'
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import MessageCard from '@/components/homePage/MessageCard.vue'
    import { getRestaurant } from '@/network/restaurantApi'
    import { ElNotification } from 'element-plus'
    import dayjs from 'dayjs'
    import { useRouter } from 'vue-router'
    import { WebSocketMsg } from '@/type/class'

    const { openWs, checkMsgs, pushMsgs } = useUserStore()
    const { msgDrawer, msgs, isLogin, user, isUser } = storeToRefs(useUserStore())
    const router = useRouter()

    const loadingUser = ref(true)
    onBeforeMount(() => {
        //进入首页获取信息
        if(isLogin.value){
            getInfo({
                onSucceed: () => {
                    openWs() //进入页面没问题就建立websocket连接
                    if(user.value!.isDeliveryMan){ //是骑手获取正在配送的单
                        getDeliveryInfo()
                        getDeliveringOrders({
                            onSucceed: orders => {
                                const msgs = orders.map(order => new WebSocketMsg(1, dayjs(), order))
                                pushMsgs(...msgs) //进入页面获取正被派送的单
                            }
                        })
                        router.push({name: 'DeliveryInformation'})
                    }
                    else if(isUser.value) {getUsersDeliveringOrders({ //获取自己下的单
                        onSucceed: orders => {
                            if(orders.length){
                                ElNotification({
                                    title: `您有${orders.length}个订单正在派送中`
                                })
                            }
                        }
                    })}
                    else {
                        getRestaurant({onError: () => {}}) //获取店铺信息
                        router.push({name: 'RestaurantInformation'})
                    }
                },
                onFinally: () => loadingUser.value = false
            })
        }
        else{
            router.push({name: 'Login'}).then(() => loadingUser.value = false)
        }
    })
    provide("headerHeightPx", 50)
</script>

<template>
    <el-container v-if="!loadingUser">
        <el-header height="50px" id="top-nav">
            <TopNav/>
        </el-header>
        <!-- body在edge有8px的margin，等多浏览器再处理 -->
        <el-main style="padding-top: calc(42px + var(--el-main-padding));">
            <RouterView v-slot="{ Component }">
                <KeepAlive include="HomeView">
                    <component :is="Component"></component>
                </KeepAlive>
            </RouterView>
            <el-drawer v-model="msgDrawer" @open="checkMsgs()">
                <template #header>
                    <h3>消息</h3>
                </template>
                <template #default>
                    <p v-show="msgs.length === 0">还没有消息哦</p>
                    <MessageCard v-for="msg of msgs" :msg="msg" />
                </template>
            </el-drawer>
        </el-main>
    </el-container>
</template>

<style>
#top-nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px rgb(180, 170, 170);
    background-color: white;
    position: fixed;
    top: 0;
    z-index: 1000;
}
.order-dialog-footer{
    font-size: 14px;
}
.order-dialog-footer > .order-op{
    margin-top: 6px;
    text-align: end;
}
</style>
