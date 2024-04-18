<script setup lang="ts">
    import { getAliRestaurantImgUrl } from '@/js/aliOssConfig'
    import { averageToFixed, fenToYuan } from '@/js/unit'
    import type { RestaurantPreview } from '@/type/class';
    import { useRouter } from 'vue-router'

    const props = defineProps<{
        restaurantPreview: RestaurantPreview
    }>()
    const router = useRouter()
</script>

<template>
    <div class="restaurant-card" @click="() => router.push({name: 'RestaurantWithCategory', params: {id: props.restaurantPreview.id}})">
        <el-image fit="fill" style="height: 100%; aspect-ratio: 1/1;" :src="getAliRestaurantImgUrl(props.restaurantPreview.imageFilename)"/>
        <div class="restaurant-card-desc">
            <span class="restaurant-card-name" :title="props.restaurantPreview.name">{{ props.restaurantPreview.name }}</span>
            <el-rate class="restaurant-card-rate" :model-value="averageToFixed(props.restaurantPreview.rate, props.restaurantPreview.rateCount, 1)"
                disabled show-score score-template="{value}" />
            <!-- 会在这里加优惠等 -->
            <div class="restaurant-card-discount">
                ...
            </div>
            <div class="restaurant-card-nums">
                <span>{{ `销售量：${props.restaurantPreview.saleNum}` }}</span>
                <span>{{ `配送费：${fenToYuan(props.restaurantPreview.deliveryPrice)}元` }}</span>
            </div>
        </div>
    </div>
</template>

<style>
.restaurant-card{
    height: 100%;
    width: 100%;
    box-shadow: 2px 2px 2px grey;
    border-radius: 4px;
    padding: 10px;
    padding-right: 4px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    background-color: var(--el-color-primary-light-8);
    cursor: pointer;
}
.restaurant-card-name{
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.restaurant-card-desc{
    flex-grow: 1;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: start;
    overflow: hidden;
}
.restaurant-card-discount{
    flex: 1;
}
.restaurant-card-nums{
    font-size: 12px;
    display: flex;
    column-gap: 8px;
    align-self: flex-end;
    white-space: nowrap;
}
</style>