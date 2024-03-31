import instance from "@/network/axios-instance"
import { defaultHandlers } from "@/network/axios-instance"
import { useRestaurantStore } from "@/stores/restaurant"
import { useUserStore } from "@/stores/user"

export function getRestaurant(handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/restaurant/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setRestaurant } = useRestaurantStore()
                setRestaurant(res.data.data) //服务器的数据给store
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getRestaurantById(restaurantId, handlers = {}) {
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/restaurant/info/${restaurantId}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getRestaurantsByPage(pageOffset, pageSize, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/restaurant/info/${pageOffset}/${pageSize}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function searchRestaurantByPrefix(prefix, size, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/restaurant/search/${size}/${prefix}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                if(res.data.data.length === 0){
                    curHandlers.onFailed(res.data.message)
                }else{
                    curHandlers.onSucceed(res.data.data)
                }
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function register(registerForm, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.post('/restaurant/register', registerForm).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setRestaurant } = useRestaurantStore()
                const { setSeller } = useUserStore()
                setRestaurant(res.data.data) //注册后初始化store
                setSeller(true) //修改身份
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function addCategory(name, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/category/add/${name}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { addCategory } = useRestaurantStore()
                addCategory(name)
                curHandlers.onSucceed(name)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function deleteCategory(index, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/category/delete/${index}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { deleteCategory } = useRestaurantStore()
                deleteCategory(index)
                curHandlers.onSucceed(index)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function updateCategory(index, name, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/category/update/${index}/${name}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { updateCategoryName } = useRestaurantStore()
                updateCategoryName(index, name)
                curHandlers.onSucceed(index, name)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function addMenu(menu, categoryIndex, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/menu/add/${categoryIndex}`, menu).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { addMenu } = useRestaurantStore()
                addMenu(menu, categoryIndex)
                curHandlers.onSucceed(menu, categoryIndex)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function deleteMenu(categoryIndex, menuIndex, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/menu/delete/${categoryIndex}/${menuIndex}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { deleteMenu } = useRestaurantStore()
                deleteMenu(categoryIndex, menuIndex)
                curHandlers.onSucceed(categoryIndex, menuIndex)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function updateMenu(menu, categoryIndex, menuIndex, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/menu/update/${categoryIndex}/${menuIndex}`, menu).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { updateMenu } = useRestaurantStore()
                updateMenu(menu, categoryIndex, menuIndex)
                curHandlers.onSucceed(categoryIndex, menuIndex)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getNotTakenOrder(id, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/restaurant/order/take/${id}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function takeOrder(id, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put(`/restaurant/order/take/${id}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function rejectOrder(id, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.delete(`/restaurant/order/delete/${id}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}