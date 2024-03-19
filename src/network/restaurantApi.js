import instance from "@/network/axios-instance"
import { useRestaurantStore } from "@/stores/restaurant"
import { useUserStore } from "@/stores/user"
import { ElMessage } from "element-plus"

export function getRestaurant(onSucceed = restaurant => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.get('/restaurant/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setRestaurant } = useRestaurantStore()
                setRestaurant(res.data.data) //服务器的数据给store
                onSucceed(res.data.data)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function getRestaurantByRestaurantId(restaurantId, onSucceed = restaurant => {}, onFailed = msg => ElMessage(msg), onError = err => {}) {
    instance.get(`/restaurant/info/${restaurantId}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                onSucceed(res.data.data)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function register(registerForm, onSucceed = restaurant => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.post('/restaurant/register', registerForm).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { init } = useRestaurantStore()
                const { setSeller } = useUserStore()
                init(res.data.data) //注册后初始化store
                setSeller(true) //修改身份
                onSucceed(res.data.data)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function addCategory(name, onSucceed = name => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.patch(`/restaurant/category/add/${name}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { addCategory } = useRestaurantStore()
                addCategory(name)
                onSucceed(name)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function deleteCategory(index, onSucceed = index => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.patch(`/restaurant/category/delete/${index}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { deleteCategory } = useRestaurantStore()
                deleteCategory(index)
                onSucceed(index)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function updateCategory(index, name, onSucceed = (index, name) => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.patch(`/restaurant/category/update/${index}/${name}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { updateCategoryName } = useRestaurantStore()
                updateCategoryName(index, name)
                onSucceed(index, name)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function addMenu(menu, categoryIndex, onSucceed = (menu, categoryIndex) => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.patch(`/restaurant/menu/add/${categoryIndex}`, menu).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { addMenu } = useRestaurantStore()
                addMenu(menu, categoryIndex)
                onSucceed(menu, categoryIndex)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function deleteMenu(categoryIndex, menuIndex, onSucceed = (categoryIndex, menuIndex) => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.patch(`/restaurant/menu/delete/${categoryIndex}/${menuIndex}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { deleteMenu } = useRestaurantStore()
                deleteMenu(categoryIndex, menuIndex)
                onSucceed(categoryIndex, menuIndex)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}

export function updateMenu(menu, categoryIndex, menuIndex, onSucceed = (menu, categoryIndex) => {}, onFailed = msg => ElMessage(msg), onError = err => {}){
    instance.patch(`/restaurant/menu/update/${categoryIndex}/${menuIndex}`, menu).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { updateMenu } = useRestaurantStore()
                updateMenu(menu, categoryIndex, menuIndex)
                onSucceed(categoryIndex, menuIndex)
            }
            else {
                onFailed(res.data.message)
            }
        }
    }).catch(onError)
}