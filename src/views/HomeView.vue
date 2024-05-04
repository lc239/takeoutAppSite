<script setup lang="ts">
    import LoadMoreInView from '@/components/LoadMoreInView.vue'
    import RestaurantCard from '@/components/homePage/RestaurantCard.vue'
    import { getRestaurantsByPage } from '@/network/restaurantApi'
    import { RestaurantPreview } from '@/type/class'
    import { ref } from 'vue'

    const restaurants = ref<RestaurantPreview[]>([])
    const loadView = ref<InstanceType<typeof LoadMoreInView> | null>(null)
    let pageOffset = 0
    const pageSize = 16
    function loadPages(){
        getRestaurantsByPage(pageOffset, pageSize,{
            onSucceed: res => {
                restaurants.value.push(...res)
                pageOffset++
                if(res.length < pageSize) loadView.value!.unobserve()
            },
            onFinally: () => loadView.value!.waitNext()
        })
    }
</script>

<template>
    <div id="home-view">
        <div id="type-filter">
            <!-- 此处预留做类型筛选 -->
            更多功能敬请期待
        </div>
        <div class="restaurant-cards">
            <RestaurantCard v-for="restaurant in restaurants" :restaurant-preview="restaurant"/>
        </div>
        <LoadMoreInView id="home-load-bottom" ref="loadView" @load="() => loadPages()" v-slot="slotProps" margin-top="10px">
            <template v-if="slotProps.observing">
                拉到底就会刷新哦
            </template>
            <template v-else>
                已经没有其他商家了
            </template>
        </LoadMoreInView>
    </div>
</template>

<style>
#home-view{
    padding: 0 40px;
}
#type-filter{
    height: 200px;
}
#home-view > .restaurant-cards{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 150px;
    column-gap: 14px;
    row-gap: 10px;
}
@media screen and (max-width: 1400px) {
    #home-view > .restaurant-cards{
        grid-template-columns: repeat(3, 1fr);
    }
}
@media screen and (max-width: 1050px) {
    #home-view > .restaurant-cards{
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (max-width: 770px) {
    #home-view > .restaurant-cards{
        grid-template-columns: 1fr;
    }
}
#home-load-bottom{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    border-radius: 6px;
    width: 100%;
    height: 50px;
    background-color: var(--el-color-primary-light-8);
}
</style>