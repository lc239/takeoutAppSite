import { computed, ref, type Ref } from 'vue'
import { aliUrlPrefix, defaultRestaurantImgFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'
import { Restaurant, Menu, OrderedMenu, Order } from '@/type/class'

export const useRestaurantStore = defineStore('restaurant', () => {

    const restaurant = ref<Restaurant | null>(null)

    const setName = (newName: string) => restaurant.value!.name = newName
    const averageRate = computed(() => ((restaurant.value?.rate as number) / (restaurant.value?.rateCount as number)).toFixed(1) || 0)

    const addCategory = (name: string) => restaurant.value!.categories.push({name, menus: []})
    const deleteCategory = (index: number) => restaurant.value!.categories.splice(index, 1)
    const updateCategoryName = (index: number, name: string) => restaurant.value!.categories[index].name = name
    const addMenu = (menu: Menu, index: number) => restaurant.value!.categories[index].menus.push(menu)
    const checkMenuName = (name: string, index: number) => {
        if(name.length === 0) return false;
        const menus = restaurant.value!.categories[index].menus
        for(let i = 0; i < menus.length; i++){
            if(name === menus[i].name) return false
        }
        return true
    }
    const deleteMenu = (categoryIndex: number, menuIndex: number) => restaurant.value!.categories[categoryIndex].menus.splice(menuIndex, 1)
    const updateMenu = (menu: Menu, categoryIndex: number, menuIndex: number) => restaurant.value!.categories[categoryIndex].menus[menuIndex] = menu
    const setMenuImageFilename = (filename: string, categoryIndex: number, menuIndex: number) => restaurant.value!.categories[categoryIndex].menus[menuIndex].imageFilename = filename

    const setAvatarFilename = (newFilename: string) => restaurant.value!.imageFilename = newFilename
    const avatarUrl = computed(() => aliUrlPrefix.concat(restaurant.value?.imageFilename || defaultRestaurantImgFilename))

    function setRestaurant(newRestaurant: Restaurant){
        restaurant.value = newRestaurant
    }

    function findMenuByOrderedMenu(orderedMenu: OrderedMenu){
        return restaurant.value!.categories[orderedMenu.categoryIndex].menus.find(menu => orderedMenu.name === menu.name)
    }

    const takenOrders = ref<Order[]>([])
    const takeOrder = (order: Order) => {
        console.log(order)
        takenOrders.value.push(order)
        console.log(takenOrders.value)
    }
    const findOrderById = (id: string) =>{
        console.log(id)
        return takenOrders.value.find(order => order.orderId === id)
    }
    const checkingOrderId = ref<string | undefined>(undefined)

    const orderDialogVisible = ref(false)
    const showOrderDialog = (orderId?: string) => {
        checkingOrderId.value = orderId
        orderDialogVisible.value = true
    }
    const closeOrderDialog = () => orderDialogVisible.value = false

    return{
        restaurant, setName, setAvatarFilename, avatarUrl, averageRate, setRestaurant, findMenuByOrderedMenu,
        addCategory, deleteCategory, updateCategoryName, addMenu, checkMenuName, deleteMenu, updateMenu, setMenuImageFilename, 
        orderDialogVisible, showOrderDialog, closeOrderDialog, takenOrders, takeOrder, findOrderById, checkingOrderId
    }
})