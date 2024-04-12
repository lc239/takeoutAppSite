import instance, { MyApiHandlers, type MyApiHandler } from "@/network/axios-instance"
import { defaultHandlers } from "@/network/axios-instance"
import { useUserStore } from "@/stores/user"
import { useHistoryStore } from '@/stores/history'
import { storeToRefs } from "pinia"
import router from "@/router"
import type { Address, Order, RestaurantComment, User } from "@/type/class"

// export function getInfo(){
//     return instance.get('/user/info').then(res => {
//         if(res.status === 200){
//             if(res.data.code === 0) {
//                 const { setInfo } = useUserStore()
//                 setInfo(res.data.data) //获取用户信息写入store
//             }
//             else {
//                 //获取信息失败就去登录页
//                 router.push({name: 'Login'})
//             }
//             return res.data
//         }
//     })
// }

export function getInfo(handlers: MyApiHandler<User> = {}){
    // const curHandlers = {...handlers, __proto__: defaultHandlers}
    // const curHandlers = {...defaultHandlers, ...handlers}
    const curHandlers: MyApiHandlers<User> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/user/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setInfo } = useUserStore()
                setInfo(res.data.data) //获取用户信息写入store
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function login(loginInfo: {phone: string, password: string}, handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.post('/user/login', loginInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setTokens, openWs } = useUserStore()
                setTokens(res.data.data.token, res.data.data.refreshToken)
                //登录成功获取一次用户信息
                getInfo({onSucceed: () => {
                    router.push('/')
                    openWs()
                }})
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function register(registerInfo: {phone: string, username: string, password: string}, handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.post('/user/register', registerInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setTokens, openWs } = useUserStore()
                setTokens(res.data.data.token, res.data.data.refreshToken)
                getInfo({ onSucceed: () => {
                    router.push('/')
                    openWs() //开启websocket
                } }) //注册成功登录，获取用户信息
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function modifyUsername(newUsername: string, handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put('/user/update/username', {username: newUsername}).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { user } = storeToRefs(useUserStore());
                (user.value as User).username = newUsername //修改成功修改store
                curHandlers.onSucceed()
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getOrders({pageOffset, pageSize}: {pageOffset: number, pageSize: number}, handlers: MyApiHandler<Order[]> = {}) {
    const curHandlers: MyApiHandlers<Order[]> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/user/orders/${pageOffset}/${pageSize}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function putOrder(order: Order, restaurantId: number, handlers: MyApiHandler<Order> = {}){
    const curHandlers: MyApiHandlers<Order> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put(`/user/order/put/${restaurantId}`, order).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function addAddress(address: Address, handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch('/user/address/add', address).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { addAddress } = useUserStore()
                addAddress(address)
                curHandlers.onSucceed()
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function setAddresses(addressArr: Address[], handlers: MyApiHandler<never> = {}){
    const curHandlers: MyApiHandlers<never> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put('/user/address/set', addressArr).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setAddresses } = useUserStore()
                setAddresses(addressArr)
                curHandlers.onSucceed()
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function commentOrder(orderId: string, comment: RestaurantComment, handlers: MyApiHandler<RestaurantComment> = {}){
    const curHandlers: MyApiHandlers<RestaurantComment> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.put(`/user/order/comment/${orderId}`, comment).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                curHandlers.onSucceed(res.data.data)
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getDeliveringOrders(handlers: MyApiHandler<Order[]> = {}){
    const curHandlers: MyApiHandlers<Order[]> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/user/orders/delivering').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setOrders } = useHistoryStore()
                setOrders(res.data.data)
                curHandlers.onSucceed(res.data.data)
            }else{
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}