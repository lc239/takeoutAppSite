import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useShoppingStore = defineStore('shopping', () => {
    const restaurant = ref({
        id: '',
        name: '',
        introduction: '',
        imageFilename: '',
        saleNum: 0,
        rate: 0,
        rateCount: 0,
        categories: [],
        deliveryPrice: 0
    })
    const categories = computed(() => restaurant.value.categories)
    const setRestaurant = r => {
        r.categories.forEach((category, index) => category.menus.forEach(menu => menu.categoryIndex = index)) //为menu设置categoryIndex方便处理
        restaurant.value = r
    }
    const currentCategoryIndex = ref(0)
    const setCurCategoryIndex = i => currentCategoryIndex.value = i
    const selectedCategory = computed(() => restaurant.value.categories[currentCategoryIndex.value])
    const shoppingCar = ref(new Map()) //Map(menu, num)
    const menus = computed(() => Array.from(shoppingCar.value.keys()))
    const addMenu = menu => shoppingCar.value.set(menu, (shoppingCar.value.get(menu) + 1) || 1)
    const removeMenu = menu => {
        const num = shoppingCar.value.get(menu)
        if(num > 1) shoppingCar.value.set(menu, num - 1)
        else shoppingCar.value.delete(menu)
    }
    const clearShoppingCar = () => shoppingCar.value.clear()
    const getMenuCount = menu => shoppingCar.value.get(menu) || 0
    const totalPrice = computed(() => {
        let res = 0
        for(const [menu, num] of shoppingCar.value){
            res += menu.price * num
        }
        return res
    })
    const orderedMenus = computed(() => Array.from(shoppingCar.value.entries()).map(e => {
        return {
            name: e[0].name,
            price: e[0].price,
            categoryIndex: e[0].categoryIndex,
            num: e[1]
        }
    }))

    const shoppingDialogVisible = ref(false)
    const showShoppingDialog = () => shoppingDialogVisible.value = true
    const closeShoppingDialog = () => shoppingDialogVisible.value = false

    const addAddressDialogVisible = ref(false)
    const showAddAddressDialog = () => addAddressDialogVisible.value = true
    const closeAddAddressDialog = () => addAddressDialogVisible.value = false

    function init(){
        restaurant.value = {
            name: '',
            introduction: '',
            imageFilename: '',
            saleNum: 0,
            rate: 0,
            rateCount: 0,
            categories: [],
            deliveryPrice: 0
        }
        closeShoppingDialog()
        setCurCategoryIndex(0)
        shoppingCar.value.clear()
    }
    return {
        restaurant, setRestaurant, categories, currentCategoryIndex, setCurCategoryIndex, selectedCategory, shoppingCar, init,
        addMenu, removeMenu, menus, orderedMenus, getMenuCount, totalPrice, clearShoppingCar,
        shoppingDialogVisible, showShoppingDialog, closeShoppingDialog, addAddressDialogVisible, showAddAddressDialog, closeAddAddressDialog
    }
})