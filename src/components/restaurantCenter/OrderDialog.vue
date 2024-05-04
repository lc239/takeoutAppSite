<script setup lang="ts">
    import MenuCard from '@/components/restaurantPage/MenuCard.vue'
    import { useRestaurantStore } from '@/stores/restaurant'
    import type { Menu, Order } from '@/type/class'
    import { computed } from 'vue'

    const props = defineProps<{
        order: Order | null
    }>()

    const { findMenuByOrderedMenu } = useRestaurantStore()

    const menus = computed(() => props.order?.menus.map(menu => findMenuByOrderedMenu(menu) || menu))

</script>

<template>
    <el-dialog class="order-dialog" title="订单详情" v-loading="$props.order ? false : true">
        <el-scrollbar height="400px">
            <div v-for="menu of menus" class="menu">
                <MenuCard :menu="(menu as Menu)" />
            </div>
        </el-scrollbar>
        <template #footer>
            <slot name="footer"></slot>
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