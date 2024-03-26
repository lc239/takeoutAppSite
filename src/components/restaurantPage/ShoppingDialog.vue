<script setup>
    import { useShoppingStore } from '@/stores/shopping';
    import { storeToRefs } from 'pinia';
    import MenuCard from '@/components/restaurantPage/MenuCard.vue'

    const { shoppingDialogVisible, menus } = storeToRefs(useShoppingStore())
    const { closeShoppingDialog, clearShoppingCar } = useShoppingStore()
</script>

<template>
    <el-dialog v-model="shoppingDialogVisible" title="购物车" class="shopping-dialog">
        <el-scrollbar height="400px">
            <div class="menus">
                <MenuCard v-for="menu of menus" class="ordered-menu" :menu="menu" />
                <span v-if="!menus.length">还没有添加菜品哦</span>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="clearShoppingCar()">清空购物车</el-button>
                <el-button type="primary" @click="closeShoppingDialog()">下单</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style>
.shopping-dialog .menus{
    height: 82px;
    width: 100%;
}
.menus > .ordered-menu{
    margin-bottom: 10px;
}
</style>