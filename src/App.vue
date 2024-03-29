<script setup>
    import TopNav from '@/components/homePage/TopNav.vue'
    import { onBeforeMount } from 'vue'
    import { getInfo } from '@/network/userApi'
    import { useUserStore } from '@/stores/user'
    import { storeToRefs } from 'pinia'
    import MessageCard from '@/components/homePage/MessageCard.vue'

    const { openWs, checkMsgs, removeMsg } = useUserStore()
    const { msgDrawer, msgs } = storeToRefs(useUserStore())

    onBeforeMount(() => {
        //进入首页获取信息
        getInfo({
            onSucceed: () => openWs() //进入页面没问题就建立websocket连接
        })
    })
</script>

<template>
    <el-container>
        <el-header height="40" class="top-nav">
            <TopNav/>
        </el-header>
        <el-main>
            <RouterView v-slot="{ Component }">
                <KeepAlive include="HomeView">
                    <component :is="Component"></component>
                </KeepAlive>
            </RouterView>
            <el-drawer v-model="msgDrawer" @open="checkMsgs()">
                <template #title>
                    <h3>消息</h3>
                </template>
                <template #default>
                    <p v-show="msgs.length === 0">还没有消息哦</p>
                    <MessageCard v-for="(msg, index) of msgs" :msg="msg" @delete="removeMsg(index)"/>
                </template>
            </el-drawer>
        </el-main>
    </el-container>
</template>

<style>
    .top-nav {
        padding: 6px 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px rgb(180, 170, 170);
    }
</style>
