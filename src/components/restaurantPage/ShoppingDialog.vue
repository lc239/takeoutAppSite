<script setup>
    import { useShoppingStore } from '@/stores/shopping'
    import { storeToRefs } from 'pinia'
    import MenuCard from '@/components/restaurantPage/MenuCard.vue'
    import { useUserStore } from '@/stores/user'
    import { computed, ref } from 'vue'
    import { putOrder } from '@/network/userApi'
    import { ElMessage } from 'element-plus'

    const { shoppingDialogVisible, menus, orderedMenus, restaurant } = storeToRefs(useShoppingStore())
    const { closeShoppingDialog, clearShoppingCar, showAddAddressDialog } = useShoppingStore()
    const { addresses } = storeToRefs(useUserStore())
    const withKeyAddresses = computed(() => addresses.value.map((e, i) => {return {...e, id: i}}))
    const addressSelect = ref()
    const orderDisabled = ref(false)
    function handleOrder(){
        if(addressSelect.value){
            ElMessage('请稍等')
            orderDisabled.value = true
            console.log(orderedMenus.value)
            putOrder({menus: orderedMenus.value, address: addressSelect.value}, restaurant.value.id, {
                onSucceed: () => {
                    ElMessage({
                        message: '下单成功，等待商家接单',
                        type: 'success'
                    })
                    closeShoppingDialog()
                },
                onFinally: () => orderDisabled.value = false
            })
        }else if(orderedMenus.value.length === 0){
            ElMessage('还没点餐呢')
        }
        else{
            ElMessage('请选择地址')
        }
    }
</script>

<template>
    <el-dialog v-model="shoppingDialogVisible" title="购物车" class="shopping-dialog">
        <el-scrollbar height="400px">
            <div v-for="menu of menus" class="menu">
                <MenuCard :menu="menu" op />
                <span v-if="!menus.length">还没有添加菜品哦</span>
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="dialog-footer">
                <el-select v-model="addressSelect" placeholder="选择配送地址" value-key="id" style="padding-bottom: 8px;">
                    <el-option v-for="address of withKeyAddresses" :label="`${address.name},${address.phone},${address.address}`" :value="address" />
                    <template #footer>
                        <el-button @click="showAddAddressDialog()">添加新地址</el-button>
                    </template>
                </el-select>
                <el-button @click="clearShoppingCar()">清空购物车</el-button>
                <el-button type="primary" @click="handleOrder()" :disabled="orderDisabled">下单</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.shopping-dialog .menu{
    height: 82px;
    width: 100%;
}
.menu + .menu{
    margin-top: 10px;
}
</style>