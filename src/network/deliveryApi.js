import instance from "@/network/axios-instance"
import { defaultHandlers } from "@/network/axios-instance"
import { useDeliveryStore } from "@/stores/delivery"
import { useUserStore } from '@/stores/user'

export function getInfo(handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/delivery/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setStore } = useDeliveryStore()
                setStore(res.data.data) //服务器的数据给store
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function register(handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.post('/delivery/register').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setDeliveryMan } = useUserStore()
                setDeliveryMan(true) //修改用户信息
                const { setStore } = useDeliveryStore()
                setStore(res.data.data) //注册信息给store
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function takeOrder(orderId, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/delivery/order/take/${orderId}`).then(res => {
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

export function completeOrder(orderId, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/delivery/order/complete/${orderId}`).then(res => {
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

export function getOrders(indexStart, indexEnd, handlers = {}){
    const curHandlers = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/delivery/order/take/${indexStart}/${indexEnd}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                console.log(res.data.data)
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}