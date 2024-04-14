import instance, { MyApiHandler, type NoResHandler, type ResHandler } from "@/network/axios-instance"
import { useRestaurantStore } from "@/stores/restaurant"
import { useUserStore } from "@/stores/user"
import type { Menu, Order, Restaurant, RestaurantComment, RestaurantPreview } from "@/type/class"

export function getRestaurant(handlers?: ResHandler<Restaurant>){
    const curHandlers: MyApiHandler<Restaurant> = new MyApiHandler(handlers)
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

export function getRestaurantById(restaurantId: number, handlers?: ResHandler<Restaurant>) {
    const curHandlers: MyApiHandler<Restaurant> = new MyApiHandler(handlers)
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

export function getRestaurantsByPage(pageOffset: number, pageSize: number, handlers?: ResHandler<RestaurantPreview[]>){
    const curHandlers: MyApiHandler<RestaurantPreview[]> = new MyApiHandler(handlers)
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

export function searchRestaurantByPrefix(prefix: string, size: number, handlers?: ResHandler<RestaurantPreview[]>){
    const curHandlers: MyApiHandler<RestaurantPreview[]> = new MyApiHandler(handlers)
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

export function register(registerForm: {name: string, introduction: string}, handlers?: ResHandler<Restaurant>){
    const curHandlers: MyApiHandler<Restaurant> = new MyApiHandler(handlers)
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

export function addCategory(name: string, handlers?: ResHandler<string>){
    const curHandlers: MyApiHandler<string> = new MyApiHandler(handlers)
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

export function deleteCategory(index: number, handlers?: ResHandler<number>){
    const curHandlers: MyApiHandler<number> = new MyApiHandler(handlers)
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

export function updateCategory(index: number, name: string, handlers?: ResHandler<{index: number, name: string}>){
    const curHandlers: MyApiHandler<{index: number, name: string}> = new MyApiHandler(handlers)
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

export function addMenu(menu: Menu, categoryIndex: number, handlers?: ResHandler<{menu: Menu, categoryIndex: number}>){
    const curHandlers: MyApiHandler<{menu: Menu, categoryIndex: number}> = new MyApiHandler(handlers)
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

export function deleteMenu(categoryIndex: number, menuIndex: number, handlers?: ResHandler<{categoryIndex: number, menuIndex: number}>){
    const curHandlers: MyApiHandler<{categoryIndex: number, menuIndex: number}> = new MyApiHandler(handlers)
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

export function updateMenu(menu: Menu, categoryIndex: number, menuIndex: number, handlers?: ResHandler<{categoryIndex: number, menuIndex: number}>){
    const curHandlers: MyApiHandler<{categoryIndex: number, menuIndex: number}> = new MyApiHandler(handlers)
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

export function getNotTakenOrder(id: string, handlers?: ResHandler<Order>){
    const curHandlers: MyApiHandler<Order> = new MyApiHandler(handlers)
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

export function takeOrder(id: string, handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
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

export function rejectOrder(id: string, handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
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

export function getComments(restaurantId: number, pageOffset: number, pageSize: number, handlers?: ResHandler<RestaurantComment[]>){
    const curHandlers: MyApiHandler<RestaurantComment[]> = new MyApiHandler(handlers)
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