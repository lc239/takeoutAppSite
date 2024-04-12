import instance, { type MyApiHandler, type MyApiHandlers } from "@/network/axios-instance"
import { defaultHandlers } from "@/network/axios-instance"
import { useDeliveryStore } from "@/stores/delivery"
import { useUserStore } from '@/stores/user'
import type { Order } from "@/type/class"

class DeliveryMan{
    completeCount: number = 0
}

export function getInfo(handlers: MyApiHandler<DeliveryMan> = {}){
    const curHandlers: MyApiHandlers<DeliveryMan> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/delivery/info').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setStore } = useDeliveryStore()
                setStore(res.data.data) //服务器的数据给store
                console.log(res.data)
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function register(handlers: MyApiHandler<DeliveryMan> = {}){
    const curHandlers: MyApiHandlers<DeliveryMan> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function takeOrder(orderId: string, handlers: MyApiHandler<Order> = {}){
    const curHandlers: MyApiHandlers<Order> = Object.assign(Object.create(defaultHandlers), handlers)
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

export function completeOrder(orderId: string, handlers: MyApiHandler<DeliveryMan> = {}){
    const curHandlers: MyApiHandlers<DeliveryMan> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.patch(`/delivery/order/complete/${orderId}`).then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { completeOrder } = useDeliveryStore()
                completeOrder(orderId)
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}

export function getOrders(indexStart: number, indexEnd: number, handlers: MyApiHandler<Order[]> = {}){
    const curHandlers: MyApiHandlers<Order[]> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get(`/delivery/order/take/${indexStart}/${indexEnd}`).then(res => {
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

export function getDeliveringOrders(handlers: MyApiHandler<Order[]> = {}){
    const curHandlers: MyApiHandlers<Order[]> = Object.assign(Object.create(defaultHandlers), handlers)
    instance.get('/delivery/order/delivering').then(res => {
        if(res.status === 200){
            if(res.data.code === 0) {
                const { setDeliveringOrders } = useDeliveryStore()
                setDeliveringOrders(res.data.data)
                curHandlers.onSucceed(res.data.data)
            }
            else {
                curHandlers.onFailed(res.data.message)
            }
        }
    }).catch(curHandlers.onError).finally(curHandlers.onFinally)
}