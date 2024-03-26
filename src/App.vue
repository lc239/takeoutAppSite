<script setup>
    import TopNav from '@/components/homePage/TopNav.vue'
    import { onBeforeMount } from 'vue';
    import { getInfo } from '@/network/userApi';

    onBeforeMount(() => {
        //进入首页获取信息
        getInfo()
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
