<script setup>
    import MenuCard from '@/components/restaurantPage/MenuCard.vue'
    import { useShoppingStore } from '@/stores/shopping'
    import { storeToRefs } from 'pinia'
    import { ShoppingCart } from '@element-plus/icons-vue'
    import { fenToYuan } from '@/js/unit';

    const { categories, selectedCategory, totalPrice, currentCategoryIndex } = storeToRefs(useShoppingStore())
    const { setCurCategoryIndex, showShoppingDialog } = useShoppingStore()
</script>

<template>
    <el-container>
        <el-aside>
            <el-menu>
                <template v-for="(category, index) of categories">
                    <el-menu-item v-if="category.menus.length" :index="index.toString()" @click="() => setCurCategoryIndex(index)">{{ category.name }}</el-menu-item>
                </template>
            </el-menu>
        </el-aside>
        <el-main v-if="selectedCategory?.menus?.length" class="category-view">
            <!-- 待加滚动，防止购物车图标挡住 -->
            <MenuCard v-for="menu of selectedCategory.menus" :menu="menu" :category-index="currentCategoryIndex" class="menu-card" />
        </el-main>
        <el-main v-else>这个分类不存在哦</el-main>
    </el-container>
    <el-button class="shopping-car" @click="showShoppingDialog()">
        <span class="total-price">{{ fenToYuan(totalPrice) + '元' }}</span>
        <el-icon><ShoppingCart/></el-icon>
    </el-button>
</template>

<style>
.category-view{
    display: grid;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    grid-auto-rows: 100px;
    column-gap: 10px;
    row-gap: 14px;
}
.category-view > .menu-card{
    cursor: pointer;
}
.shopping-car{
    position: fixed;
    bottom: 100px;
    right: 50px;
    height: 2em;
    font-size: 16px;
}
.shopping-car .total-price{
    margin-right: 7px;
}
</style>