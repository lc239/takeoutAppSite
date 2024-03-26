import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useShoppingStore = defineStore('shopping', () => {
    const restaurant = ref({
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
        restaurant.value = r
        console.log(restaurant.value)
    }
    const currentCategoryIndex = ref(0)
    const setCurCategoryIndex = i => currentCategoryIndex.value = i
    const selectedCategory = computed(() => restaurant.value.categories[currentCategoryIndex.value])
    const shoppingCar = ref(new Map())
    const addMenu = menu => shoppingCar.value.set(menu, (shoppingCar.value.get(menu) + 1) || 1)
    const removeMenu = menu => {
        const c = shoppingCar.value.get(menu)
        if(c === 1) shoppingCar.value.delete(menu)
        else shoppingCar.value.set(menu, (c - 1))
    }
    const clearShoppingCar = () => shoppingCar.value.clear()
    const getMenuCount = menu => shoppingCar.value.get(menu) || 0
    const totalPrice = computed(() => menusWithNum.value.reduce((c, n) => c + n[1] * n[0].price, 0))
    const menusWithNum = computed(() => Array.from(shoppingCar.value.entries())) //[menu, num]
    const menus = computed(() => Array.from(shoppingCar.value.keys()))

    const shoppingDialogVisible = ref(false)
    const showShoppingDialog = () => shoppingDialogVisible.value = true
    const closeShoppingDialog = () => shoppingDialogVisible.value = false

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
        addMenu, removeMenu, menus, getMenuCount, totalPrice, shoppingDialogVisible, showShoppingDialog, closeShoppingDialog, clearShoppingCar
    }
})