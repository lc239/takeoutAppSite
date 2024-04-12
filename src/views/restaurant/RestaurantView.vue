<script setup lang="ts">
    import { getAliRestaurantImgUrl } from '@/js/aliOssConfig';
    import { storeToRefs } from 'pinia'
    import { useShoppingStore } from '@/stores/shopping'
    import ShoppingDialog from '@/components/restaurantPage/ShoppingDialog.vue'
    import AddAddressDialog from '@/components/userCenter/AddAddressDialog.vue'
    import { useRoute, useRouter } from 'vue-router';
    import { onUnmounted, watch } from 'vue';
    import { getRestaurantById } from '@/network/restaurantApi'
    import { ElMessage } from 'element-plus'
    import { addAddress } from '@/network/userApi'

    const { restaurant, addAddressDialogVisible } = storeToRefs(useShoppingStore())
    const { setRestaurant, clearShoppingCar, closeAddAddressDialog } = useShoppingStore()
    const router = useRouter()
    const route = useRoute()

    watch(
        () => route.params.id,
        newId => {
            clearShoppingCar()
            getRestaurantById(parseInt(newId as string), {
                onSucceed: res => {
                    setRestaurant(res)
                }
            })
        }
    )
    function handleAddAddress(addressForm: {name: string, address: string, phone: string}){
        ElMessage("正在提交，请稍等")
        addAddress(addressForm, {
            onSucceed: () => {
                ElMessage.success({
                    type: 'success',
                    message: '添加成功'
                })
                closeAddAddressDialog()
            }
        })
    }
    onUnmounted(() => {
        clearShoppingCar()
    })
</script>

<template>
    <el-container class="restaurant-view">
        <el-header class="restaurant-view-header" height="200px">
            <div class="restaurant-desc">
                <el-image class="restaurant-view-img" :src="getAliRestaurantImgUrl(restaurant.imageFilename)"/>
                <div class="restaurant-title">
                    <span class="restaurant-name">{{ `店铺名称：${restaurant.name}` }}</span>
                    <span class="restaurant-introduction">{{ `店铺简介：${restaurant.introduction || '还没有简介'}` }}</span>
                </div>
            </div>
            <div class="restaurant-extra">
                等补充
            </div>
            <div class="restaurant-ops">
                <el-button @click="router.push({name: 'RestaurantComment'})">查看评论</el-button>
                <!-- el-button相邻有css加margin -->
                <div></div>
                <el-button>收藏此店</el-button>
            </div>
        </el-header>
        <RouterView/>
    </el-container>
    <ShoppingDialog/>
    <AddAddressDialog v-model="addAddressDialogVisible" @add-address="handleAddAddress"/>
</template>

<style>
.restaurant-view > .restaurant-view-header{
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid grey;
    background-color: var(--el-color-primary-light-8);
}
.restaurant-view-header > .restaurant-desc{
    height: 80%;
    width: 35%;
    flex-shrink: 1;
    flex-grow: 0;
    display: flex;
    column-gap: 8px;
}
.restaurant-view-header > .restaurant-extra{
    flex: 2;
}
.restaurant-view-header > .restaurant-ops{
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}
.restaurant-view-header .restaurant-view-img{
    aspect-ratio: 1/1;
    height: 100%;
    flex-shrink: 0;
}
.restaurant-view-header .restaurant-title{
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 8px;
    font-size: 14px;
    word-break: break-all;
    overflow: hidden;
}
.restaurant-title > .restaurant-name{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>