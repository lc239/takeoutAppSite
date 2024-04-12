import { defineStore } from "pinia"
import { type Ref, computed, ref } from "vue"
import { Restaurant, Menu, OrderedMenu } from "@/type/class"

export const useShoppingStore = defineStore('shopping', () => {
    const restaurant: Ref<Restaurant> = ref(new Restaurant(0, '', '', '', 0, 0, 0, [], 0))
    const categories = computed(() => restaurant.value.categories)
    const setRestaurant = (r: Restaurant) => {
        r.categories.forEach((category, index) => category.menus.forEach((menu: Menu) => menu.categoryIndex = index)) //为menu设置categoryIndex方便处理
        restaurant.value = r
    }
    const currentCategoryIndex = ref(0)
    const setCurCategoryIndex = (i: number) => currentCategoryIndex.value = i
    const selectedCategory = computed(() => restaurant.value.categories[currentCategoryIndex.value])
    const shoppingCar: Ref<Map<Menu, number>> = ref(new Map()) //Map(menu, num)
    const menus = computed(() => Array.from(shoppingCar.value.keys()))
    const addMenu = (menu: Menu) => shoppingCar.value.set(menu, (shoppingCar.value.get(menu) as number + 1) || 1)
    const removeMenu = (menu: Menu) => {
        const num = shoppingCar.value.get(menu) as number
        if(num > 1) shoppingCar.value.set(menu, num - 1)
        else shoppingCar.value.delete(menu)
    }
    const clearShoppingCar = () => shoppingCar.value.clear()
    const getMenuCount = (menu: Menu) => shoppingCar.value.get(menu) || 0
    const totalPrice = computed(() => {
        let res = 0
        for(const [menu, num] of shoppingCar.value){
            res += menu.price * num
        }
        return res
    })
    const orderedMenus = computed(() => Array.from(shoppingCar.value.entries()).map(e => {
        return new OrderedMenu(e[0].name, e[1], e[0].price, e[0].categoryIndex!)
    }))

    const shoppingDialogVisible = ref(false)
    const showShoppingDialog = () => shoppingDialogVisible.value = true
    const closeShoppingDialog = () => shoppingDialogVisible.value = false

    const addAddressDialogVisible = ref(false)
    const showAddAddressDialog = () => addAddressDialogVisible.value = true
    const closeAddAddressDialog = () => addAddressDialogVisible.value = false

    function init(){
        restaurant.value = new Restaurant(0, '', '', '', 0, 0, 0, [], 0)
        closeShoppingDialog()
        setCurCategoryIndex(0)
        shoppingCar.value.clear()
    }

    function findMenuByOrderedMenu(orderedMenu: OrderedMenu){
        return restaurant.value.categories[orderedMenu.categoryIndex].menus.find(menu => orderedMenu.name === menu.name)
    }
    return {
        restaurant, setRestaurant, categories, currentCategoryIndex, setCurCategoryIndex, selectedCategory, shoppingCar, init,
        addMenu, removeMenu, menus, orderedMenus, getMenuCount, totalPrice, clearShoppingCar, findMenuByOrderedMenu,
        shoppingDialogVisible, showShoppingDialog, closeShoppingDialog, addAddressDialogVisible, showAddAddressDialog, closeAddAddressDialog
    }
})