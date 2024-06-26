import instance, { MyApiHandler, type NoResHandler, type ResHandler } from "@/network/axios-instance"
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

export function getInfo(handlers?: ResHandler<User>){
    // const curHandlers = {...handlers, __proto__: defaultHandlers}
    // const curHandlers = {...defaultHandlers, ...handlers}
    const curHandlers: MyApiHandler<User> = new MyApiHandler(handlers)
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

export function login(loginInfo: {phone: string, password: string}, handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
    instance.post('/user/login', loginInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setTokens, openWs } = useUserStore()
                setTokens(res.data.data.token, res.data.data.refreshToken)
                //登录成功获取一次用户信息
                getInfo({onSucceed: user => {
                    console.log(user)
                    if(user.isSeller) router.push({name: 'RestaurantInformation'})
                    else if(user.isDeliveryMan) router.push({name: 'DeliveryInformation'})
                    else router.push({name: 'Home'})
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

export type RegisterForm = {
    username: string
    phone: string
    password: string
    role: 0 | 1 | 2
}

export class RegisterRequest{
    username: string = ''
    phone: string = ''
    password: string = ''
    isSeller: boolean = false
    isDeliveryMan: boolean = false
    constructor(form: RegisterForm){
        const {role, ...other} = form
        Object.assign(this, other)
        switch(role){
            case 1:
                this.isSeller = true
                break
            case 2: 
                this.isDeliveryMan = true
                break
            default:
        }
    }
}

export function register(registerInfo: RegisterRequest, handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
    instance.post('/user/register', registerInfo).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setTokens, openWs } = useUserStore()
                setTokens(res.data.data.token, res.data.data.refreshToken)
                getInfo({onSucceed: user => {
                    if(user.isSeller) router.push({name: 'RestaurantInformation'})
                    else if(user.isDeliveryMan) router.push({name: 'DeliveryInformation'})
                    else router.push('/')
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

export function modifyUsername(newUsername: string, handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
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

export function getOrders({pageOffset, pageSize}: {pageOffset: number, pageSize: number}, handlers?: ResHandler<Order[]>) {
    const curHandlers: MyApiHandler<Order[]> = new MyApiHandler(handlers)
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

export function putOrder(order: Order, restaurantId: number, handlers?: ResHandler<Order>){
    const curHandlers: MyApiHandler<Order> = new MyApiHandler(handlers)
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

export function addAddress(address: Address, handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
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

export function setAddresses(addressArr: Address[], handlers?: NoResHandler){
    const curHandlers: MyApiHandler<never> = new MyApiHandler(handlers)
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

export function commentOrder(orderId: string, comment: RestaurantComment, handlers?: ResHandler<RestaurantComment>){
    const curHandlers: MyApiHandler<RestaurantComment> = new MyApiHandler(handlers)
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

export function getDeliveringOrders(handlers?: ResHandler<Order[]>){
    const curHandlers: MyApiHandler<Order[]> = new MyApiHandler(handlers)
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