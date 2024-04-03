import { computed, ref } from 'vue'
import { aliUrlPrefix, defaultRestaurantImgFilename } from '@/js/aliOssConfig'
import { defineStore } from 'pinia'

export const useRestaurantStore = defineStore('restaurant', () => {

    const id = ref(null)
    const name = ref(null)
    const setName = newName => name.value = newName
    const introduction = ref(null)
    const saleNum = ref(null)
    const rate = ref(null)
    const rateCount = ref(null)
    const averageRate = computed(() => (rate / rateCount).toFixed(1) || 0)

    const categories = ref(null)
    const addCategory = name => categories.value.push({name, menus: []})
    const deleteCategory = index => categories.value.splice(index, 1)
    const updateCategoryName = (index, name) => categories.value[index].name = name
    const addMenu = (menu, index) => categories.value[index].menus.push(menu)
    const checkMenuName = (name, index) => {
        if(name.length === 0) return false;
        const menus = categories.value[index].menus
        for(let i = 0; i < menus.length; i++){
            if(name === menus[i].name) return false
        }
        return true
    }
    const deleteMenu = (categoryIndex, menuIndex) => categories.value[categoryIndex].menus.splice(menuIndex, 1)
    const updateMenu = (menu, categoryIndex, menuIndex) => categories.value[categoryIndex].menus[menuIndex] = menu
    const setMenuImageFilename = (filename, categoryIndex, menuIndex) => categories.value[categoryIndex].menus[menuIndex].imageFilename = filename

    const avatarFilename = ref(null)
    const setAvatarFilename = newFilename => avatarFilename.value = newFilename
    const avatarUrl = computed(() => aliUrlPrefix.concat(avatarFilename.value || defaultRestaurantImgFilename))

    function setRestaurant(restaurant){
        id.value = restaurant.id
        name.value = restaurant.name
        introduction.value = restaurant.introduction || ''
        saleNum.value = restaurant.saleNum
        rate.value = restaurant.rate
        rateCount.value = restaurant.rateCount
        categories.value = restaurant.categories
        avatarFilename.value = restaurant.imageFilename
    }

    return{
        id, name, setName, introduction, setAvatarFilename, avatarUrl, averageRate, setRestaurant,
        categories, addCategory, deleteCategory, updateCategoryName, addMenu, checkMenuName, deleteMenu, updateMenu, setMenuImageFilename
    }
})