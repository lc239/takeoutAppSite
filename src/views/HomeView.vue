<script setup>
    import LoadMoreInView from '@/components/LoadMoreInView.vue';
    import RestaurantCard from '@/components/homePage/RestaurantCard.vue';
    import { getRestaurantsByPage } from '@/network/restaurantApi';
    import { ref } from 'vue';

    const restaurants = ref([])
    const loadView = ref(null)
    let pageOffset = 0
    const pageSize = 16
    function loadPages(){
        getRestaurantsByPage(pageOffset, pageSize,{
            onSucceed: res => {
                restaurants.value.push(...res)
                pageOffset++
                if(res.length < pageSize) loadView.value.unobserve()
            },
            onFinally: () => loadView.value.waitNext()
        })
    }
</script>

<template>
    <div id="home-view">
        <!-- 此处预留做类型筛选 -->
        <div id="type-filter">
            此处预留做类型筛选
        </div>
        <div class="restaurant-cards">
            <RestaurantCard v-for="restaurant in restaurants" :restaurant-preview="restaurant"></RestaurantCard>
        </div>
        <LoadMoreInView id="home-load-bottom" ref="loadView" @load="() => loadPages()" v-slot="slotProps">
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
    grid-auto-columns: 350px;
    column-gap: 14px;
    row-gap: 10px;
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