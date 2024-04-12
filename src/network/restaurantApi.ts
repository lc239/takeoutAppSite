import instance, { type MyApiHandler, type MyApiHandlers } from "@/network/axios-instance"
import { defaultHandlers } from "@/network/axios-instance"
import { useRestaurantStore } from "@/stores/restaurant"
import { useUserStore } from "@/stores/user"
import type { Menu, Order, Restaurant, RestaurantComment, RestaurantPreview } from "@/type/class"

export function getRestaurant(handlers: MyApiHandler<Restaurant> = {}){
    const curHandlers: MyApiHandlers<Restaurant> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function getRestaurantById(restaurantId: number, handlers: MyApiHandler<Restaurant> = {}) {
    const curHandlers: MyApiHandlers<Restaurant> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function getRestaurantsByPage(pageOffset: number, pageSize: number, handlers: MyApiHandler<RestaurantPreview[]> = {}){
    const curHandlers: MyApiHandlers<RestaurantPreview[]> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function searchRestaurantByPrefix(prefix: string, size: number, handlers: MyApiHandler<RestaurantPreview[]> = {}){
    const curHandlers: MyApiHandlers<RestaurantPreview[]> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function register(registerForm: {name: string, introduction: string}, handlers: MyApiHandler<Restaurant> = {}){
    const curHandlers: MyApiHandlers<Restaurant> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function addCategory(name: string, handlers: MyApiHandler<string> = {}){
    const curHandlers: MyApiHandlers<string> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function deleteCategory(index: number, handlers: MyApiHandler<number> = {}){
    const curHandlers: MyApiHandlers<number> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function updateCategory(index: number, name: string, handlers: MyApiHandler<{index: number, name: string}> = {}){
    const curHandlers: MyApiHandlers<{index: number, name: string}> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/category/update/${index}/${name}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { updateCategoryName } = useRestaurantStore()
                updateCategoryName(index, name)
                curHandlers.onSucceed({index, name})
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function addMenu(menu: Menu, categoryIndex: number, handlers: MyApiHandler<{menu: Menu, categoryIndex: number}> = {}){
    const curHandlers: MyApiHandlers<{menu: Menu, categoryIndex: number}> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/menu/add/${categoryIndex}`, menu).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { addMenu } = useRestaurantStore()
                addMenu(menu, categoryIndex)
                curHandlers.onSucceed({menu, categoryIndex})
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function deleteMenu(categoryIndex: number, menuIndex: number, handlers: MyApiHandler<{categoryIndex: number, menuIndex: number}> = {}){
    const curHandlers: MyApiHandlers<{categoryIndex: number, menuIndex: number}> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/menu/delete/${categoryIndex}/${menuIndex}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { deleteMenu } = useRestaurantStore()
                deleteMenu(categoryIndex, menuIndex)
                curHandlers.onSucceed({categoryIndex, menuIndex})
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function updateMenu(menu: Menu, categoryIndex: number, menuIndex: number, handlers: MyApiHandler<{categoryIndex: number, menuIndex: number}> = {}){
    const curHandlers: MyApiHandlers<{categoryIndex: number, menuIndex: number}> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/restaurant/menu/update/${categoryIndex}/${menuIndex}`, menu).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { updateMenu } = useRestaurantStore()
                updateMenu(menu, categoryIndex, menuIndex)
                curHandlers.onSucceed({categoryIndex, menuIndex})
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getNotTakenOrder(id: string, handlers: MyApiHandler<Order> = {}){
    const curHandlers: MyApiHandlers<Order> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function takeOrder(id: string, handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put(`/restaurant/order/take/${id}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function rejectOrder(id: string, handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.delete(`/restaurant/order/delete/${id}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getComments(restaurantId: number, pageOffset: number, pageSize: number, handlers: MyApiHandler<RestaurantComment[]> = {}){
    const curHandlers: MyApiHandlers<RestaurantComment[]> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/restaurant/comment/${restaurantId}/${pageOffset}/${pageSize}`).then(res => {
        console.log(res)
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